<template>
	<main class="w-full pt-10 gap-15 flex flex-col items-center">
		<div>
			<div class="join">
				<button
					v-for="(_, key) in component"
					:key="key"
					:class="{
						'btn btn-outline btn-block join-item btn-primary': name_of_component != key,
						'btn btn-block join-item btn-primary': name_of_component == key,
					}"
					@click="set_component(key)"
				>
					{{ key }}
				</button>
			</div>
		</div>

		<Transition mode="out-in" name="list">
			<Component :is="component[name_of_component]" class="w-full lg:w-1/2" />
		</Transition>
	</main>
</template>

<script setup lang="ts">
import AuthList from '@/components/AuthList.vue'
import VoteList from '@/components/VoteList.vue'
import { ref, shallowRef } from 'vue'

const component = shallowRef({ auth: AuthList, vote: VoteList })
const name_of_component = ref('auth')

function set_component(name: string) {
	name_of_component.value = name
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-leave-to {
	opacity: 0;
	transform: translateX(100px);
}

.list-enter-from {
	opacity: 0;
	transform: translateX(-100px);
}
</style>
