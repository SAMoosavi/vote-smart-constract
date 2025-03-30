import { ethers } from 'ethers'

export function connect(): { provider: ethers.JsonRpcProvider; wallet: ethers.Wallet } {
	const RPC_URL = 'http://127.0.0.1:8545'
	const PRIVATE_KEY = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'

	const provider = new ethers.JsonRpcProvider(RPC_URL)
	const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

	return { provider, wallet }
}
