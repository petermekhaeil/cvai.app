import {  redirect } from '@sveltejs/kit'

export const load = async ({ locals: { getSession } }) => {
  const session = await getSession()

  return { session }
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
