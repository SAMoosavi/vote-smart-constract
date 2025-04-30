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
			console.error('[VoteService]', err)
			throw err
		}
	}

	getCandidates(): Promise<Vote.CandidateStructOutput> {
		return this.safe(() => this.contract.getCandidates())
	}

	getCandidateNames(): Promise<string[]> {
		return this.safe(() => this.contract.getCandidateNames())
	}

	startVoting(): Promise<ContractTransactionResponse> {
		return this.safe(() => this.contract.startVoting())
	}

	endVoting(): Promise<ContractTransactionResponse> {
		return this.safe(() => this.contract.endVoting())
	}
}
