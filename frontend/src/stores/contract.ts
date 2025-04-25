import { defineStore } from 'pinia'
import { VoteCreatorService } from '@/functions/VoteCreator.ts'
import { ref } from 'vue'
import { DEFLATE_PRIVATE_KEY } from '@/functions/Connector.ts'

export const useContractStore = defineStore('contract', () => {
	const vote_creator = ref<VoteCreatorService>(
		new VoteCreatorService({
			rpcUrl: 'http://127.0.0.1:8545',
			privateKey: DEFLATE_PRIVATE_KEY,
			contractAddress: '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f',
		}),
	)

	return { vote_creator }
})
