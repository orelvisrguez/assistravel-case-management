import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { nombre: string; apellido: string; rol: 'admin' | 'user' }) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Paso 1: Autenticación con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo obtener los datos del usuario');

      // Paso 2: Intentar obtener datos del usuario desde la tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // Si no encuentra el usuario en la tabla, crear uno básico o usar datos de auth
      if (userError || !userData) {
        console.warn('Usuario no encontrado en tabla usuarios, usando datos de auth');
        
        // Intentar crear el usuario en la tabla usuarios
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            email: authData.user.email || email,
            nombre: authData.user.user_metadata?.nombre || 'Usuario',
            apellido: authData.user.user_metadata?.apellido || '',
            rol: authData.user.user_metadata?.rol || 'user',
          });

        if (insertError) {
          console.error('Error creando usuario en tabla:', insertError);
        }

        // Usar datos básicos del auth
        set({
          user: {
            id: authData.user.id,
            email: authData.user.email || email,
            nombre: authData.user.user_metadata?.nombre || 'Usuario',
            apellido: authData.user.user_metadata?.apellido || '',
            role: authData.user.user_metadata?.rol || 'user',
          },
          loading: false,
        });
      } else {
        // Usuario encontrado en la tabla
        set({
          user: {
            id: userData.id,
            email: userData.email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            role: userData.rol,
          },
          loading: false,
        });
      }
    } catch (error: any) {
      console.error('Error en signIn:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, userData: { nombre: string; apellido: string; rol: 'admin' | 'user' }) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            rol: userData.rol,
          },
        },
      });

      if (authError) throw authError;

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Intentar obtener datos del usuario desde la tabla usuarios
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!userError && userData) {
          set({
            user: {
              id: userData.id,
              email: userData.email,
              nombre: userData.nombre,
              apellido: userData.apellido,
              role: userData.rol,
            },
            loading: false,
          });
        } else {
          // Si no encuentra el usuario en la tabla, usar datos básicos de la sesión
          console.warn('Usuario no encontrado en tabla usuarios durante checkAuth');
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              nombre: session.user.user_metadata?.nombre || 'Usuario',
              apellido: session.user.user_metadata?.apellido || '',
              role: session.user.user_metadata?.rol || 'user',
            },
            loading: false,
          });
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error: any) {
      console.error('Error checking auth:', error);
      set({ user: null, loading: false });
    }
  },
}));

// Listener para cambios de autenticación
supabase.auth.onAuthStateChange(async (event, session) => {
  const { checkAuth } = useAuthStore.getState();
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null });
  } else if (event === 'SIGNED_IN' && session) {
    await checkAuth();
  }
});