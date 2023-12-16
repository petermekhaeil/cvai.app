import { redirect } from '@sveltejs/kit'
import { OPENAI_API_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'

export const load = async (event) => {
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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const useOwnKey = OPENAI_API_KEY === '';

  let user = null;

  if (session) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    user = data;
  }

  return { session, useOwnKey, user }
}

export const actions = {
  signout: async (event) => {
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

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
}
