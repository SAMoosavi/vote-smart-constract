<template>
	<main class="w-full flex flex-col gap-10 container m-auto items-center">
		<div class="w-full flex flex-col items-center">
			<h1
				class="text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
			>
				Votereum
			</h1>
			<p class="text-2xl font-bold text-center pt-5 text-base-content">
				Decentralized, Democratic, and Secure: The New Standard in Voting
			</p>
		</div>

		<div class="w-full flex lg:flex-row flex-col gap-2 items-center justify-center">
			<h2 class="lg:text-5xl text-3xl font-bold text-center lg:flex-2/3">
				So far,
				<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
					<span ref="number_of_vote">0</span> <span>Votereum</span>
				</span>
				have been created.
			</h2>
			<RouterLink v-if="user.isLoggedIn" to="/dashboard" class="btn btn-primary btn-dash lg:flex-1/3 mx-auto">
				create your Votereum
			</RouterLink>
			<RouterLink v-else to="/register" class="btn btn-primary btn-dash lg:flex-1/3 mx-auto">
				create account
			</RouterLink>
		</div>

		<ul class="list">
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
	</main>
</template>

<script setup lang="ts">
import { animate, utils } from 'animejs'
import { onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useContractStore } from '@/stores/contract'
import { useUserStore } from '@/stores/user.ts'
import type { VoteCreator } from '../../../typechain-types'

const number_of_vote_ref = useTemplateRef('number_of_vote')
const contract = useContractStore()
const user = useUserStore()

const votes = ref<VoteCreator.VoteDataStructOutput[]>()

onMounted(async () => {
	contract.vote_creator.getTotalVotes().then((response) => {
		const number_of_voterum = Number(response)
		animate(number_of_vote_ref.value as HTMLElement, {
			modifier: utils.round(0),
			innerHTML: [0, number_of_voterum],
			easing: 'inBack',
			duration: 2000,
		})
	})

	contract.vote_creator.getAllVotes().then((res) => {
		votes.value = res
	})
})
</script>
