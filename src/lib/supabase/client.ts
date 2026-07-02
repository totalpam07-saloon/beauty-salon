import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        ...(process.env.NODE_ENV === 'production' ? { domain: `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` } : {}),
      },
    }
  )
}
