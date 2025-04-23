import { JsonRpcProvider, Wallet } from 'ethers'

/**
 * Configuration for your JSON-RPC connection
 */
export interface ConnectionConfig {
	/** RPC endpoint (defaults to http://127.0.0.1:8545) */
	rpcUrl?: string
	/** Your wallet’s private key (must be 0x-prefixed and 66 chars long) */
	privateKey: string
}

export function createConnection(config: ConnectionConfig): {
	provider: JsonRpcProvider
	wallet: Wallet
} {
	const rpcUrl = config.rpcUrl ?? 'http://127.0.0.1:8545'

	// Basic validation of the key – avoids subtle bugs later
	if (!config.privateKey.startsWith('0x') || config.privateKey.length !== 66)
		throw new Error(`Invalid privateKey provided: expected a 0x-prefixed 64-byte hex string`)

	const provider = new JsonRpcProvider(rpcUrl)
	const wallet = new Wallet(config.privateKey, provider)

	return { provider, wallet }
}
