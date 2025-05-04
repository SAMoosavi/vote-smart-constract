import { JsonRpcProvider, Wallet, BrowserProvider, JsonRpcSigner, type Eip1193Provider } from 'ethers'

// export const DEFLATE_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
// export const DEFLATE_PRIVATE_KEY = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6'
export const DEFLATE_PRIVATE_KEY = '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a'

declare global {
	interface Window {
		ethereum?: Eip1193Provider
	}
}

const DEFAULT_RPC_URL = 'http://127.0.0.1:8545'

export async function createConnection(): Promise<{
	provider: BrowserProvider | JsonRpcProvider
	signer: JsonRpcSigner | Wallet
}> {
	if (window.ethereum) {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' })

			const provider = new BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()


			return { provider, signer }
		} catch (error) {
			console.error('MetaMask connection failed:', error)
		}
	}

	// Fallback to default key and RPC provider
	console.warn('MetaMask not found, falling back to default wallet')

	const provider = new JsonRpcProvider(DEFAULT_RPC_URL)
	const wallet = new Wallet(DEFLATE_PRIVATE_KEY, provider)

	return { provider, signer: wallet }
}
