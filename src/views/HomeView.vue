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
			<RouterLink to="/dashboard" class="btn btn-primary btn-dash lg:flex-1/3 mx-auto">
				create your Votereum
			</RouterLink>
		</div>
	</main>
</template>

<script setup lang="ts">
import anime from 'animejs/lib/anime.es.js'
import { useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'

const number_of_vote_ref = useTemplateRef('number_of_vote')

const number_of_voterum = 20

watch(number_of_vote_ref, (v) => {
	if (v != null) {
		anime({
			targets: number_of_vote_ref.value,
			innerHTML: [0, number_of_voterum],
			easing: 'easeOutBack',
			round: 1,
		})
	}
})
</script>
