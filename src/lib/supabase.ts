import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para verificar si el usuario es admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  return data.rol === 'admin';
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};