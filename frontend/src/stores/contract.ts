import { defineStore } from 'pinia'
import { VoteCreatorService } from '@/functions/VoteCreator.ts'
import { ref } from 'vue'

export const useContractStore = defineStore('contract', () => {
	const vote_creator = ref<VoteCreatorService>()

	async function init() {
		vote_creator.value = await VoteCreatorService.init('0xB581C9264f59BF0289fA76D61B2D0746dCE3C30D')
	}

	return { vote_creator, init }
})
