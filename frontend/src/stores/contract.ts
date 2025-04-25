import { defineStore } from 'pinia'
import { VoteCreatorService } from '@/functions/VoteCreator.ts'
import { ref } from 'vue'

export const useContractStore = defineStore('contract', () => {
	const vote_creator = ref<VoteCreatorService>(
		new VoteCreatorService({
			rpcUrl: 'http://127.0.0.1:8545',
			privateKey: '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e',
			contractAddress: '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f',
		}),
	)

	return { vote_creator }
})
