import { AuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/utils/supabase'
import type { Session } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined | null>()
  const [user, setUser] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching session:', error)
      }

      setSession(session)
      setIsLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch the profile when the session changes
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)

      if (session) {
        // console.log(session.user.user_metadata)
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        setUser(data)
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    fetchUser()
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        user,
        isLoggedIn: session != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}