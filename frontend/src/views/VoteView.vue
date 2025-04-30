<template>
	<main class="w-full pt-10 gap-15 flex flex-col items-center">
		<div class="w-full lg:w-1/2 card">
			<div class="card-title self-center">
				<h2 class="text-5xl font-bold">Candidate list</h2>
			</div>

			<div class="divider"></div>

			<div class="card-body">
				<ul class="list">
					<li class="list-row items-center" v-for="(val, index) in candidate_names" :key="index">
						<h3 class="text-3xl">{{ val }}</h3>
						<button @click="vote_handler(val, index)" class="btn btn-square btn-ghost ml-auto">
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
	</main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { VoteService } from '@/functions/Vote.ts'
import { DEFLATE_PRIVATE_KEY } from '@/functions/Connector.ts'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const route = useRoute()

const vote = new VoteService({
	privateKey: DEFLATE_PRIVATE_KEY,
	contractAddress: route.params.address as string,
})

const candidate_names = ref<string[]>([])

onMounted(async () => {
	vote.getCandidateNames()
		.then((candidateNames) => {
			candidate_names.value = candidateNames
		})
		.catch(console.error)
})

function vote_handler(name: string, index: number) {
	console.log(name, index)
}
</script>

<style scoped></style>
