import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Corresponsal, CorresponsalFormData } from '@/types';

interface CorresponsalesState {
  corresponsales: Corresponsal[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchCorresponsales: () => Promise<void>;
  getCorresponsalById: (id: number) => Promise<Corresponsal | null>;
  createCorresponsal: (data: CorresponsalFormData) => Promise<void>;
  updateCorresponsal: (id: number, data: Partial<CorresponsalFormData>) => Promise<void>;
  deleteCorresponsal: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCorresponsalesStore = create<CorresponsalesState>((set, get) => ({
  corresponsales: [],
  loading: false,
  error: null,

  fetchCorresponsales: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('corresponsal')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

      set({ corresponsales: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getCorresponsalById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('corresponsal')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createCorresponsal: async (data: CorresponsalFormData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('corresponsal')
        .insert(data);

      if (error) throw error;

      // Recargar corresponsales
      await get().fetchCorresponsales();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCorresponsal: async (id: number, data: Partial<CorresponsalFormData>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('corresponsal')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      // Recargar corresponsales
      await get().fetchCorresponsales();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCorresponsal: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('corresponsal')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recargar corresponsales
      await get().fetchCorresponsales();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));