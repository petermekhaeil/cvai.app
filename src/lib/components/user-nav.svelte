<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	type Image = string | null | undefined;

	let initals = '';

	$: {
		const name = $page.data.session?.user?.name;
		if (name) {
			const names = name.split(' ');
			initals = names[0].charAt(0) + names[1].charAt(0);
		}
	}
</script>

{#if $page.data.session}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
				<Avatar.Root class="h-8 w-8">
					{#if $page.data.session.user?.image}
						<Avatar.Image src={$page.data.session.user?.image} alt="" />
					{/if}
					<Avatar.Fallback>{initals}</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Label class="font-normal">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none">
						{$page.data.session.user?.name}
					</p>
					<p class="text-xs leading-none text-muted-foreground">
						{$page.data.session.user?.email}
					</p>
				</div>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={() => signOut()}>Log out</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
