import { redirect } from '@sveltejs/kit'
import { OPENAI_API_KEY } from '$env/static/private';

export const load = async ({ locals: { getSession } }) => {
  const session = await getSession()

  const useOwnKey = OPENAI_API_KEY === '';

  return { session, useOwnKey }
}

export const actions = {
  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession()
    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
}
