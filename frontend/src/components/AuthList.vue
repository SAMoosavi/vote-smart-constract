<template>
	<div class="card w-full mt-5">
		<div class="card-title self-center">
			<h2 class="text-5xl font-bold">Auth list</h2>
		</div>
		<div class="divider"></div>
		<div class="card-body">
			<div class="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
				<div
					class="card border border-base-content/20 shadow-sm hover:shadow-primary/20 hover:cursor-pointer bg-red-500"
					@click="create_auth"
				>
					<div class="card-body self-center">
						<span class="text-6xl font-bold">+</span>
					</div>
				</div>

				<div class="card border border-base-content/20 shadow-sm shadow-primary/20" v-for="i in 2" :key="i">
					<div class="card-title self-center">
						<h3 class="text-3xl">name</h3>
					</div>
					<div class="card-body">
						<span class="text-sm truncate"> 0xdjhafjaf5545d4fasf5sg35fd5a4d5gsa54g5</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { createAuth, getAuth } from '@/functions/vote_creator/VoteCreator'

async function create_auth() {
	console.log('a')

	await createAuth('test')
	await getAuth()
}
</script>
