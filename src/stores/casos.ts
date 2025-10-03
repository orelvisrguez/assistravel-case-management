import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Caso, CasoFormData, FiltrosCaso, ResultadoPaginado } from '@/types';

interface CasosState {
  casos: Caso[];
  loading: boolean;
  error: string | null;
  filtros: FiltrosCaso;
  paginacion: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Acciones
  fetchCasos: (filtros?: FiltrosCaso, page?: number, limit?: number) => Promise<void>;
  getCasoById: (id: number) => Promise<Caso | null>;
  createCaso: (data: CasoFormData) => Promise<void>;
  updateCaso: (id: number, data: Partial<CasoFormData>) => Promise<void>;
  deleteCaso: (id: number) => Promise<void>;
  setFiltros: (filtros: FiltrosCaso) => void;
  clearError: () => void;
}

export const useCasosStore = create<CasosState>((set, get) => ({
  casos: [],
  loading: false,
  error: null,
  filtros: {},
  paginacion: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchCasos: async (filtros = {}, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('caso')
        .select(`
          *,
          corresponsal (
            id,
            nombre,
            contacto,
            email,
            pais_sede
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filtros.corresponsal_id) {
        query = query.eq('corresponsal_id', filtros.corresponsal_id);
      }
      
      if (filtros.pais) {
        query = query.eq('pais', filtros.pais);
      }
      
      if (filtros.fecha_inicio && filtros.fecha_fin) {
        query = query.gte('fecha_de_inicio', filtros.fecha_inicio)
                    .lte('fecha_de_inicio', filtros.fecha_fin);
      }
      
      if (filtros.busqueda) {
        query = query.or(`nro_caso_assistravel.ilike.%${filtros.busqueda}%,nro_caso_corresponsal.ilike.%${filtros.busqueda}%,pais.ilike.%${filtros.busqueda}%`);
      }

      // Filtrar por estado de factura
      if (filtros.estado_factura) {
        switch (filtros.estado_factura) {
          case 'Sin Factura':
            query = query.eq('tiene_factura', false);
            break;
          case 'Pagada':
            query = query.not('fecha_pago_factura', 'is', null);
            break;
          case 'Vencida':
            query = query.eq('tiene_factura', true)
                        .is('fecha_pago_factura', null)
                        .lt('fecha_vencimiento_factura', new Date().toISOString());
            break;
          case 'Pendiente':
            query = query.eq('tiene_factura', true)
                        .is('fecha_pago_factura', null)
                        .gte('fecha_vencimiento_factura', new Date().toISOString());
            break;
        }
      }

      // Aplicar paginación
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      set({
        casos: data || [],
        filtros,
        paginacion: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getCasoById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('caso')
        .select(`
          *,
          corresponsal (
            id,
            nombre,
            contacto,
            email,
            telefonos,
            pagina_web,
            direccion,
            pais_sede
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createCaso: async (data: CasoFormData) => {
    set({ loading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('caso')
        .insert({
          ...data,
          created_by: userData.user?.id,
        });

      if (error) throw error;

      // Recargar casos
      await get().fetchCasos(get().filtros, get().paginacion.page, get().paginacion.limit);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCaso: async (id: number, data: Partial<CasoFormData>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('caso')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      // Recargar casos
      await get().fetchCasos(get().filtros, get().paginacion.page, get().paginacion.limit);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCaso: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('caso')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recargar casos
      await get().fetchCasos(get().filtros, get().paginacion.page, get().paginacion.limit);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setFiltros: (filtros: FiltrosCaso) => {
    set({ filtros });
  },

  clearError: () => set({ error: null }),
}));