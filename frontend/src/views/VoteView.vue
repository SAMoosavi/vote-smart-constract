<template>
	<main class="w-full pt-10 gap-15 flex flex-col items-center">
		<PieChart class="max-h-96" :labels="chartLabels" :data="chartData" />

		<div :class="{ 'grid gap-5 lg:grid-cols-2 grid-cols-1': access, '': !access }">
			<div v-if="access" class="card">
				<div class="card-title self-center">
					<h2 class="text-5xl font-bold">Manage</h2>
				</div>
				<div class="divider"></div>
				<div class="card-body">
					<button :disabled="votingStarted" @click="start_vote" class="btn btn-dash btn-primary">
						start vote
					</button>
					<button
						:disabled="!votingStarted || votingEnded"
						@click="end_vote"
						class="btn btn-dash btn-secondary"
					>
						finish vote
					</button>
				</div>
			</div>

			<div class="w-full card">
				<div class="card-title self-center">
					<h2 class="text-5xl font-bold">Candidate list</h2>
				</div>

				<div class="divider"></div>

				<div class="card-body">
					<ul class="list">
						<li class="list-row items-center" v-for="(val, index) in candidate_names" :key="index">
							<h3 class="text-3xl">{{ val }}</h3>
							<button
								:disabled="!votingStarted || hasVoted || votingEnded"
								@click="vote_handler(val, index)"
								class="btn btn-square btn-ghost ml-auto"
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
										d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
									/>
								</svg>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { VoteService } from '@/functions/Vote.ts'
import { createConnection, DEFLATE_PRIVATE_KEY } from '@/functions/Connector.ts'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useContractStore } from '@/stores/contract.ts'
import { useUserStore } from '@/stores/user.ts'
import { ethers } from 'ethers'
import type { User } from '@/functions/api-handler.ts'
import type { Vote } from '@/build'
import PieChart from '@/components/PieChart.vue'

const route = useRoute()
const vote_address = route.params.address as string

const vote_creator_store = useContractStore()

const vote = new VoteService({
	privateKey: DEFLATE_PRIVATE_KEY,
	contractAddress: vote_address,
})

const candidate_names = ref<string[]>([])
const access = ref<boolean>(false)

const user = ref<User | null>()

onMounted(async () => {
	user.value = useUserStore().user
	if (user.value) {
		toast.error('You are not logged in')
	}

	await Promise.all([voting_started(), voting_ended(), has_voted(), loadCandidateNames(), checkAccessToVote()])
})

async function loadCandidateNames() {
	vote.getCandidateNames()
		.then((candidateNames) => {
			candidate_names.value = candidateNames
		})
		.catch(toast.error)
}

async function checkAccessToVote() {
	vote_creator_store.vote_creator.hasAccessToVote(vote_address).then((r) => (access.value = r))
}

async function vote_handler(name: string, index: number) {
	if (!user.value) {
		toast.error('User data is missing')
		return
	}
	const { wallet } = createConnection({ privateKey: DEFLATE_PRIVATE_KEY })
	const public_address = user.value.public_address
	const age = user.value.age

	vote.getNonce(public_address)
		.then((nonce) => {
			const message = ethers.solidityPackedKeccak256(
				['address', 'uint256', 'uint64', 'uint256'],
				[public_address, index, age, nonce],
			)
			wallet
				.signMessage(ethers.getBytes(message))
				.then((signature) => {
					vote.vote(index, age, nonce, signature)
						.then(() => {
							toast.success('Vote successfully submitted')
							get_candidates_vote().catch(toast.error)
						})
						.catch(toast.error)
						.finally(has_voted)
				})
				.catch(toast.error)
		})
		.catch(toast.error)
}

function start_vote() {
	vote.startVoting()
		.then(() => {
			toast.success('voterume started')
		})
		.catch(toast.error)
		.finally(voting_started)
}

const votingStarted = ref<boolean>(false)

async function voting_started() {
	vote.votingStarted().then((r) => (votingStarted.value = r))
}

const votingEnded = ref<boolean>(false)

async function voting_ended() {
	vote.votingEnded()
		.then((r) => {
			votingEnded.value = r
		})
		.finally(get_candidates_vote)
}

function end_vote() {
	vote.endVoting()
		.then(() => {
			toast.success('voterume ended')
		})
		.catch(toast.error)
		.finally(voting_ended)
}

const hasVoted = ref(false)

async function has_voted() {
	if (!user.value) return

	const public_address = user.value.public_address

	vote.hasVoted(public_address).then((r) => (hasVoted.value = r))
}

const candidate_vote = ref<Vote.CandidateStructOutput[]>()

async function get_candidates_vote() {
	vote.getCandidates().then((candidates) => {
		candidate_vote.value = candidates
	})
}

const total_vote = computed<bigint>(
	() => candidate_vote.value?.reduce((sum, candidate) => sum + candidate.voteCount, 0n) ?? 0n,
)

const chartLabels = computed(() => candidate_vote.value?.map((c) => c.name) ?? [])

const chartData = computed(
	() => candidate_vote.value?.map((c) => Number((c.voteCount * 10000n) / total_vote.value) / 100) ?? [],
)
</script>
