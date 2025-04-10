<template>
	<div class="card">
		<div class="card-title self-center">
			<h2 class="text-5xl font-bold">Auth list</h2>
		</div>

		<div class="divider"></div>
		<div class="card-body">
			<ul class="list w-full">
				<li class="list-row items-center" @click="create_auth_modal_ref?.showModal()">
					<h3 class="text-3xl">create new auth</h3>

					<button class="btn btn-square btn-ghost ml-auto">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</button>
					<dialog ref="create_auth_modal" class="modal modal-bottom sm:modal-middle">
						<div class="modal-box justify-content-center text-center">
							<form method="dialog">
								<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
							</form>
							<h3 class="text-lg font-bold">Create Auth</h3>
							<p class="py-4">please enter name of auth</p>
							<form
								@submit.prevent="
									() => {
										create_auth()
											.then(() => create_auth_modal_ref?.close())
											.catch(() => {})
									}
								"
								class="flex flex-col gap-5 items-center text-center"
							>
								<input
									type="text"
									v-model="auth_name"
									autofocus
									placeholder="auth name"
									class="input input-secondary w-full"
								/>
								<button :disabled="creating" class="btn btn-block btn-dash btn-primary" type="submit">
									<span v-show="creating" class="loading loading-spinner loading-md"></span>
									create
								</button>
							</form>
						</div>
					</dialog>
				</li>

				<li class="list-row items-center" v-for="(val, index) in auths" :key="index">
					<h3 class="text-3xl">{{ val[1] }}</h3>
					<span class="text-sm truncate opacity-60"> {{ val[0] }}</span>
					<RouterLink
						:to="{ name: 'show-auth', params: { address: val[0] } }"
						class="btn btn-square btn-ghost"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
							/>
						</svg>
					</RouterLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { createAuth, getAuth } from '@/functions/VoteCreator.ts'
import { onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const auths = ref([])

const auth_name = ref('')
const creating = ref(false)
const create_auth_modal_ref = useTemplateRef('create_auth_modal')

async function create_auth() {
	if (creating.value) return
	if (auth_name.value === '') throw new Error('please enter name of auth name')

	creating.value = true
	createAuth(auth_name.value)
		.then(async () => {
			await get_auth()
		})
		.catch((err) => {
			console.log(err)})
		.finally(() => {
			creating.value = false
			auth_name.value = ''
		})
}

async function get_auth() {
	auths.value = await getAuth()
}

onMounted(get_auth)
</script>
