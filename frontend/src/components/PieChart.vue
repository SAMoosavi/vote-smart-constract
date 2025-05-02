<template>
	<Pie
		class="text-base-content"
		:data="{
			labels,
			datasets: [{ data, backgroundColor }],
		}"
		:options="{
			responsive: true,
			plugins: {
				legend: { position: 'bottom' },
			},
			color: textColor,
		}"
	/>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js'
import { ref, onMounted } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

defineProps<{
	labels: string[]
	data: number[]
}>()

function onDaisyUIThemeChange(callback: () => void) {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
				callback()
			}
		}
	})

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	})
}

function resolveTailwindStyle(className: string, cssProperty: keyof CSSStyleDeclaration): string {
	const el = document.createElement('div')
	el.className = className
	Object.assign(el.style, {
		position: 'absolute',
		visibility: 'hidden',
		pointerEvents: 'none',
	})
	document.body.appendChild(el)
	const value = getComputedStyle(el)[cssProperty]?.toString()
	el.remove()
	return value || ''
}

let currentPrimaryColor = resolveTailwindStyle('bg-primary', 'backgroundColor')

onDaisyUIThemeChange(() => {
	currentPrimaryColor = resolveTailwindStyle('bg-primary', 'backgroundColor')
	console.log('Theme changed! New primary color:', currentPrimaryColor)
})

const textColor = ref<string>('')
const backgroundColor = ref<string[]>()

onMounted(() => {
	const update = () => {
		textColor.value = resolveTailwindStyle('bg-primary', 'backgroundColor')
		backgroundColor.value = [
			resolveTailwindStyle('bg-primary', 'backgroundColor'),
			resolveTailwindStyle('bg-secondary', 'backgroundColor'),
			resolveTailwindStyle('bg-accent', 'backgroundColor'),
			resolveTailwindStyle('bg-primary/50', 'backgroundColor'),
			resolveTailwindStyle('bg-secondary/50', 'backgroundColor'),
			resolveTailwindStyle('bg-accent/50', 'backgroundColor'),
		]
	}
	update()
	onDaisyUIThemeChange(update)
})
</script>
