<template>
	<main class="w-full pt-10 gap-15 flex flex-col items-center">
		<div class="w-full lg:w-1/2 card">
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
										() =>
											create_vote()
												.then(() => create_vote_modal_ref?.close())
												.catch((e) => toast.error(e))
									"
									class="flex flex-col gap-5 pt-5 items-center text-center"
								>
									<label class="floating-label w-full">
										<input
											type="text"
											v-model.trim.lazy="form.vote_name"
											autofocus
											placeholder="vote name"
											required
											class="input input-secondary w-full"
										/>
										<span>vote name</span>
									</label>

									<label class="floating-label w-full">
										<input
											type="number"
											v-model.number.trim.lazy="form.min_age"
											autofocus
											placeholder="minimum age"
											required
											class="input input-secondary w-full"
										/>
										<span>minimum age</span>
									</label>

									<label class="floating-label w-full">
										<input
											type="number"
											v-model.number.trim.lazy="form.max_age"
											autofocus
											placeholder="maximum age"
											required
											class="input input-secondary w-full"
										/>
										<span>maximum age</span>
									</label>

									<label class="floating-label w-full">
										<input
											type="number"
											v-model.number.trim.lazy="form.number_of_candidate"
											autofocus
											placeholder="number of candidate"
											required
											class="input input-secondary w-full"
										/>
										<span>number of candidate</span>
									</label>

									<label class="floating-label w-full" v-for="i in form.number_of_candidate" :key="i">
										<input
											type="text"
											v-model.trim.lazy="form.candidate_names[i - 1]"
											autofocus
											placeholder="candidate name"
											required
											class="input input-secondary w-full"
										/>
										<span>candidate name {{ i }}</span>
									</label>

									<button
										:disabled="creating"
										class="btn btn-block btn-dash btn-primary"
										type="submit"
									>
										<span v-show="creating" class="loading loading-spinner loading-md"></span>
										create
									</button>
								</form>
							</div>
						</dialog>
					</li>

					<li class="list-row items-center" v-for="(val, index) in votes" :key="index">
						<h3 class="text-3xl">{{ val.voteName }}</h3>
						<span class="text-sm truncate opacity-60"> {{ val.voteAddress }}</span>
						<RouterLink
							:to="{ name: 'vote', params: { address: val.voteAddress } }"
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
	</main>
</template>

<script setup lang="ts">
import { useContractStore } from '@/stores/contract.ts'
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { type VoteCreator } from '@/build/index.ts'

const contractStore = useContractStore()

const votes = ref<VoteCreator.VoteDataStructOutput[]>()

interface Form {
	vote_name: string
	min_age: number
	max_age: number
	candidate_names: string[]
	number_of_candidate: number
}

const form = reactive<Form>({
	vote_name: '',
	min_age: 0,
	max_age: 0,
	candidate_names: ['', ''],
	number_of_candidate: 2,
})

watch(
	() => form.number_of_candidate,
	(value) => {
		const v = Math.max(2, value)
		form.number_of_candidate = v

		const diff = v - form.candidate_names.length
		if (diff > 0) form.candidate_names.push(...Array(diff).fill(''))
		else if (diff < 0) form.candidate_names.splice(v)
	},
)

const creating = ref(false)
const create_vote_modal_ref = useTemplateRef('create_vote_modal')

function hasDuplicates(arr: string[]): boolean {
	const seen = new Set<string>()
	for (const item of arr) {
		const trimmed = item.trim()
		if (seen.has(trimmed)) return true
		seen.add(trimmed)
	}
	return false
}

async function create_vote() {
	if (creating.value) return

	if (form.vote_name === '') throw 'please enter name of vote name'
	if (form.min_age < 0) throw 'the minimum age is less than 0'
	if (form.max_age != 0 && form.min_age > form.max_age) throw 'the maximum age is less than minimum age'
	if (hasDuplicates(form.candidate_names)) throw 'Duplicate name found in candidate names'

	creating.value = true
	contractStore.vote_creator
		.createVote(form.vote_name, form.candidate_names, form.min_age, form.max_age)
		.then(async () => {
			toast.success('create votereum successfully.')
			creating.value = false
			form.vote_name = ''
			form.candidate_names = []
			form.number_of_candidate = 2
			form.min_age = 0
			form.max_age = 0
			await get_vote()
		})
		.catch((e) => {
			toast.error('create votereum failed')
			console.error(e)
		})
}

async function get_vote() {
	contractStore.vote_creator.getMyVotes().then((res) => {
		votes.value = res
	})
}

onMounted(get_vote)
</script>
