import type { Database } from '$lib/database.types.js';

type User = Database['public']['Tables']['users']['Row'];
type History = Database['public']['Tables']['history']['Row'];

type UserHistory = User & { history: History[] };

export const load = async (event) => {
	const session = await event.locals.getSession();
	const supabase = event.locals.supabase;

	let user: UserHistory | null = null;

	if (session?.user) {
		const { data } = await supabase
			.from('users')
			.select('*, history(*)')
			.eq('id', session.user.id)
			.single()
			.returns<UserHistory>();

		user = data;
	}

	return { user };
};
