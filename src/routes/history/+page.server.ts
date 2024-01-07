export const load = async (event) => {
	const session = await event.locals.getSession();
	const supabase = event.locals.supabase;

	let user = null;

	if (session?.user) {
		const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();

		user = data;
	}

	return { user };
};
