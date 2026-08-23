import { supabase } from '../api/supabaseClient'

export async function getProfileById(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) {
    throw error
  }

  return data
}
