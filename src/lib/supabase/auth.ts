import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Verifica se há um admin autenticado. Retorna o user ou null.
 * Usar no início de toda API Route de admin antes de qualquer escrita.
 */
export async function getAdminUser() {
  const supabase = createServerAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Cliente Supabase com sessão via cookies (anon key).
 * Usado para autenticação do admin: getUser(), signOut() server-side.
 * Em Server Components o set/remove de cookie é no-op (só leitura permitida);
 * em Route Handlers a escrita de cookie funciona normalmente.
 */
export function createServerAuthClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Component: ignorado (a sessão é escrita pelo browser client)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server Component: ignorado
          }
        },
      },
    }
  )
}
