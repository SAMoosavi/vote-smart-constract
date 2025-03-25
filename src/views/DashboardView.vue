<template>
	<main class="w-full flex md:flex-row flex-col gap-10 container m-auto items-center">
		<!-- <VoteList /> -->
		<AuthList />
	</main>
</template>

<script setup lang="ts">
import AuthList from '@/components/AuthList.vue'
import VoteList from '@/components/VoteList.vue'
</script>
