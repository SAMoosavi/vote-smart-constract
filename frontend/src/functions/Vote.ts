import { type Vote, Vote__factory } from '@/build'
import { createConnection } from '@/functions/Connector.ts'
import type { ContractTransactionResponse } from 'ethers'

export interface VoteConfig {
	/** JSON-RPC endpoint (defaults to http://127.0.0.1:8545) */
	rpcUrl?: string
	/** 0x-prefixed 64-byte hex private key */
	privateKey: string
	/** Deployed Vote address */
	contractAddress: string
}

export class VoteService {
	private readonly contract: Vote

	constructor(private readonly config: VoteConfig) {
		// wire up signer
		const { wallet } = createConnection({
			rpcUrl: config.rpcUrl,
			privateKey: config.privateKey,
		})

		// connect typed contract factory
		this.contract = Vote__factory.connect(config.contractAddress, wallet)
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
