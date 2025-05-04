import { ContractTransactionResponse, parseEther } from 'ethers'
import { type VoteCreator, VoteCreator__factory } from '@/build'
import { createConnection } from './Connector.ts'

export interface VoteCreatorConfig {
	/** JSON-RPC endpoint (defaults to http://127.0.0.1:8545) */
	rpcUrl?: string
	/** 0x-prefixed 64-byte hex private key */
	privateKey: string
	/** Deployed VoteCreator address */
	contractAddress: string
}

export class VoteCreatorService {
	private contract!: VoteCreator

	private constructor() {}

	static async init(contractAddress: string): Promise<VoteCreatorService> {
		const instance = new VoteCreatorService()
		const { signer } = await createConnection()
		instance.contract = VoteCreator__factory.connect(contractAddress, signer)
		return instance
	}

	/** internal helper for consistent try/catch */
	private async safe<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn()
		} catch (err) {
			console.error('[VoteCreatorService]', err)
			throw err
		}
	}

	/** deploy a new Vote (default fee=0.5 ETH, gasLimit=2.15 M) */
	createVote(
		voteName: string,
		candidateNames: string[],
		minAge: number,
		maxAge: number,
		fee = parseEther('0.5'),
		gasLimit = 2_152_000,
	): Promise<ContractTransactionResponse> {
		return this.safe(() =>
			this.contract.createVote(voteName, candidateNames, minAge, maxAge, { value: fee, gasLimit }),
		)
	}

	/** get all votes you created */
	getMyVotes(): Promise<VoteCreator.VoteDataStructOutput[]> {
		return this.safe(() => this.contract.getMyVotes())
	}

	/** get every vote ever created */
	getAllVotes(): Promise<VoteCreator.VoteDataStructOutput[]> {
		return this.safe(() => this.contract.getAllVotes())
	}

	/** check if *you* created a given vote contract */
	hasAccessToVote(voteAddr: string): Promise<boolean> {
		return this.safe(() => this.contract.AccessToVote(voteAddr))
	}

	/** total votes ever created */
	getTotalVotes(): Promise<bigint> {
		return this.safe(() => this.contract.getNumberOfVotes())
	}

	/** how many votes *you* created */
	getMyVoteCount(): Promise<bigint> {
		return this.safe(() => this.contract.getNumberOfMyVotes())
	}
}
