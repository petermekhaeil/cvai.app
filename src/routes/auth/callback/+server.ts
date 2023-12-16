import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'

export const GET = async (event) => {
  const {
    url,
  } = event;
  const code = url.searchParams.get('code') as string;
  const next = url.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, options)
        },
        remove: (key, options) => {
          event.cookies.delete(key, options)
        },
      },
    })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('does this log get picked up on vercel??')
    console.log(data);
    console.log(error);

    if (!error) {
      throw redirect(303, `/${next.slice(1)}`);
    }

    console.error(error);
  }

  // return the user to an error page with instructions
  throw redirect(303, '/auth/auth-code-error');
};