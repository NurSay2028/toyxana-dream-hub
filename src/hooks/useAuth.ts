import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSuperAdmin: boolean;
  hallId: string | null;
  isHallAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isSuperAdmin: false,
    hallId: null,
    isHallAdmin: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;

        if (user) {
          // Check roles - use setTimeout to avoid deadlocks
          setTimeout(async () => {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .eq('role', 'super_admin')
              .maybeSingle();

            const { data: adminData } = await supabase
              .from('hall_admins')
              .select('hall_id')
              .eq('user_id', user.id)
              .maybeSingle();

            setState({
              user,
              session,
              loading: false,
              isSuperAdmin: !!roleData,
              hallId: adminData?.hall_id ?? null,
              isHallAdmin: !!adminData,
            });
          }, 0);
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            isSuperAdmin: false,
            hallId: null,
            isHallAdmin: false,
          });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin
  }
});
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signInWithGoogle, signOut };
}
