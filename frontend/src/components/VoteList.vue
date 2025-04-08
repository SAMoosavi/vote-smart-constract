<template>
	<div class="card">
		<div class="card-title self-center">
			<h2 class="text-5xl font-bold">Vote list</h2>
		</div>

		<div class="divider"></div>

		<div class="card-body">
			<ul class="list">
				<li class="list-row items-center" @click="create_vote_modal_ref?.showModal()">
					<h3 class="text-3xl">create new vote</h3>

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
					<dialog ref="create_vote_modal" class="modal modal-bottom sm:modal-middle">
						<div class="modal-box justify-content-center text-center">
							<form method="dialog">
								<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
							</form>
							<h3 class="text-lg font-bold">Create Vote</h3>
							<form
								@submit.prevent="
									() => {
										create_vote()
											.then(() => create_vote_modal_ref?.close())
											.catch(() => {})
									}
								"
								class="flex flex-col gap-5 pt-5 items-center text-center"
							>
								<input
									type="text"
									v-model.trim.lazy="vote_name"
									autofocus
									placeholder="vote name"
									required
									class="input validator input-secondary w-full"
								/>

								<select class="select select-secondary w-full validator" required v-model="auth_address">
									<option disabled selected value="">select an auth</option>
									<option v-for="auth in auths" :key="auth[1]" :value="auth[0]">{{ auth[1] }}</option>
								</select>

								<input
									type="number"
									v-model.number.trim.lazy="number_of_candidate"
									autofocus
									placeholder="vote name"
									required
									class="input validator input-secondary w-full"
								/>

								<input
									type="text"
									v-for="i in number_of_candidate"
									:key="i"
									v-model.trim.lazy="candidate_names[i - 1]"
									autofocus
									placeholder="vote name"
									required
									class="input validator input-secondary w-full"
								/>

								<button :disabled="creating" class="btn btn-block btn-dash btn-primary" type="submit">
									<span v-show="creating" class="loading loading-spinner loading-md"></span>
									create
								</button>
							</form>
						</div>
					</dialog>
				</li>

				<li class="list-row items-center" v-for="(val, index) in votes" :key="index">
					<h3 class="text-3xl">{{ val[1] }}</h3>
					<span class="text-sm truncate opacity-60"> {{ val[0] }}</span>
					<button class="btn btn-square btn-ghost">
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
					</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { createVote, getAuth, getVote } from '@/functions/VoteCreator.ts'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const votes = ref([])

const vote_name = ref('')
const auth_address = ref('')
const creating = ref(false)
const create_vote_modal_ref = useTemplateRef('create_vote_modal')
const number_of_candidate = ref(2)
const candidate_names = ref([])

watch(number_of_candidate, (v) => {
	if (v < 2) number_of_candidate.value = 2
})

async function create_vote() {
	if (creating.value) return
	if (vote_name.value === '') throw new Error('please enter name of vote name')

	creating.value = true
	await createVote(auth_address.value, vote_name.value, candidate_names.value)
	await get_vote()
	creating.value = false
	vote_name.value = ''
	auth_address.value = ''
	candidate_names.value = []
	number_of_candidate.value = 2
}

async function get_vote() {
	votes.value = await getVote()
}

const auths = ref([])

async function get_auths() {
	auths.value = await getAuth()
}

onMounted(() => {
	get_vote()
	get_auths()
})
</script>
