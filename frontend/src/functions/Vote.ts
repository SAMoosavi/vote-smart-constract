import { type Vote, Vote__factory } from '@/build'
import { createConnection } from '@/functions/Connector.ts'
import type { ContractTransactionResponse } from 'ethers'

export class VoteService {
	private contract!: Vote

	constructor() {}

	static async init(contractAddress: string): Promise<VoteService> {
		const instance = new VoteService()
		const { signer } = await createConnection()
		instance.contract = Vote__factory.connect(contractAddress, signer)
		return instance
	}

	/** internal helper for consistent try/catch */
	private async safe<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn()
		} catch (err) {
			if (err && typeof err == 'object' && 'data' in err)
				throw `[VoteService] ${Vote__factory.createInterface().parseError(err.data).name}`
			else throw err
		}
	}

	getCandidates(): Promise<Vote.CandidateStructOutput[]> {
		return this.safe(() => this.contract.getCandidates())
	}

	getCandidateNames(): Promise<string[]> {
		return this.safe(() => this.contract.getCandidateNames())
	}

	startVoting(): Promise<ContractTransactionResponse> {
		return this.safe(() => this.contract.startVoting())
	}

	votingStarted(): Promise<boolean> {
		return this.safe(() => this.contract.votingStarted())
	}

	votingEnded(): Promise<boolean> {
		return this.safe(() => this.contract.votingEnded())
	}

	endVoting(): Promise<ContractTransactionResponse> {
		return this.safe(() => this.contract.endVoting())
	}

	getWinner(): Promise<{ winners: string[]; winningVoteCount: bigint }> {
		return this.safe(async () => {
			const [winners, winningVoteCount] = await this.contract.getWinner()
			return { winners, winningVoteCount }
		})
	}

	vote(candidateIndex: number, age: number, nonce: bigint, signature: string): Promise<ContractTransactionResponse> {
		return this.safe(() => this.contract.vote(candidateIndex, age, nonce, signature))
	}

	getNonce(address: string): Promise<bigint> {
		return this.safe(() => this.contract.nonces(address))
	}

	hasVoted(address: string): Promise<boolean> {
		return this.safe(() => this.contract.hasVoted(address))
	}

	getMinAge(): Promise<bigint> {
		return this.safe(() => this.contract.minAge())
	}

	getMaxAge(): Promise<bigint> {
		return this.safe(() => this.contract.maxAge())
	}

	isEligible(age: bigint): Promise<boolean> {
		return this.safe(() => this.contract.isEligible(age))
	}
}
