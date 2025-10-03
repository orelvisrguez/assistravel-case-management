import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { KPIDashboard, CasosPorPais, Caso } from '@/types';

interface DashboardState {
  kpis: KPIDashboard | null;
  casosPorPais: CasosPorPais[];
  casosRecientes: Caso[];
  casosAtencion: Caso[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  kpis: null,
  casosPorPais: [],
  casosRecientes: [],
  casosAtencion: [],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Obtener KPIs
      const { data: kpisData, error: kpisError } = await supabase
        .from('kpi_dashboard')
        .select('*')
        .single();

      if (kpisError) throw kpisError;

      // Obtener casos por país
      const { data: paisesDatas, error: paisesError } = await supabase
        .from('casos_por_pais')
        .select('*');

      if (paisesError) throw paisesError;

      // Obtener casos recientes (últimos 5 actualizados)
      const { data: casosRecientesData, error: recientesError } = await supabase
        .from('caso')
        .select(`
          *,
          corresponsal (
            nombre
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (recientesError) throw recientesError;

      // Obtener casos que requieren atención
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 30);
      
      const { data: casosAtencionData, error: atencionError } = await supabase
        .from('caso')
        .select(`
          *,
          corresponsal (
            nombre
          )
        `)
        .or(`and(tiene_factura.eq.false,fecha_de_inicio.lt.${fechaLimite.toISOString().split('T')[0]}),and(fecha_vencimiento_factura.lt.${new Date().toISOString().split('T')[0]},fecha_pago_factura.is.null)`)
        .order('fecha_de_inicio', { ascending: true })
        .limit(10);

      if (atencionError) throw atencionError;

      // Calcular casos con costos altos (3 veces por encima del promedio)
      const { data: allCasos, error: allCasosError } = await supabase
        .from('caso')
        .select('costo_total');

      if (!allCasosError && allCasos) {
        const promedio = allCasos.reduce((sum, caso) => sum + (caso.costo_total || 0), 0) / allCasos.length;
        const umbralAlto = promedio * 3;

        const { data: casosAltosData, error: altosError } = await supabase
          .from('caso')
          .select(`
            *,
            corresponsal (
              nombre
            )
          `)
          .gte('costo_total', umbralAlto)
          .order('costo_total', { ascending: false })
          .limit(5);

        if (!altosError && casosAltosData) {
          const casosAtencionCompletos = [...(casosAtencionData || []), ...casosAltosData];
          // Eliminar duplicados por ID
          const casosUnicos = casosAtencionCompletos.filter((caso, index, self) => 
            index === self.findIndex(c => c.id === caso.id)
          );
          
          set({
            kpis: kpisData,
            casosPorPais: paisesDatas || [],
            casosRecientes: casosRecientesData || [],
            casosAtencion: casosUnicos,
            loading: false,
          });
          return;
        }
      }

      set({
        kpis: kpisData,
        casosPorPais: paisesDatas || [],
        casosRecientes: casosRecientesData || [],
        casosAtencion: casosAtencionData || [],
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));