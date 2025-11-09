import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { useEffect, useState } from "react"

const baseURL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:5173';

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    authClient.getSession()
      .then((session) => {
        if (mounted) {
          setUser(session?.data?.user || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
