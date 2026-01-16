import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  username: string | null
  language: string | null
  notifications_enabled: boolean | null
}

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

export const useProfile = create<ProfileState>((set) => ({
  profile: null,
  loading: true,
  error: null,

  fetchProfile: async () => {
    try {
      set({ loading: true, error: null })
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        set({ profile: null, loading: false })
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      set({ 
        profile: data || { 
            id: user.id, 
            email: user.email, 
            full_name: user.user_metadata?.full_name || 'Utilisateur',
            avatar_url: user.user_metadata?.avatar_url || null,
            username: user.user_metadata?.username || null,
            language: user.user_metadata?.language || 'fr',
            notifications_enabled: user.user_metadata?.notifications_enabled ?? true
        }, 
        loading: false 
      })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ profile: null })
    window.location.href = '/login'
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      set({ loading: true, error: null })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
        loading: false
      }))
    } catch (err: any) {
      set({ error: err.message, loading: false })
      throw err
    }
  }
}))
