import { redirect } from '@sveltejs/kit'
import { OPENAI_API_KEY } from '$env/static/private';

export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()

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
  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession()
    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
}
