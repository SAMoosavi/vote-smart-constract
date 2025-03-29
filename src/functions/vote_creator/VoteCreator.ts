import { ethers } from 'ethers'
import contractJson from '@/../build/VoteCreator.json'

function connect(): { provider: ethers.JsonRpcProvider; wallet: ethers.Wallet } {
	const RPC_URL = 'http://127.0.0.1:8545'
	const PRIVATE_KEY = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'

	const provider = new ethers.JsonRpcProvider(RPC_URL)
	const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

	return { provider, wallet }
}

function loadContract(): { provider: ethers.JsonRpcProvider; wallet: ethers.Wallet; contract: ethers.Contract } {
	const { provider, wallet } = connect()

	const abi = contractJson.abi
	const CONTRACT_ADDRESS = '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f'
	const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet)

	return { provider, wallet, contract }
}

export const createAuth = async (name: string) => {
	const { contract } = loadContract()

	try {
		const value = ethers.parseEther('1')

		const tx = await contract.createAuth(name, {
			value: value,
			gasLimit: 2152000,
		})

		await tx.wait()
		console.log('Transaction successful:', tx)
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export const createVote = async (auth_address: string, name: string, candidate_names: string[]) => {
	const { contract } = loadContract()

	try {
		const value = ethers.parseEther('0.5')

		const tx = await contract.createVote(auth_address, name, candidate_names, {
			value: value,
			gasLimit: 2152000,
		})

		await tx.wait()
		console.log('Transaction successful:', tx)
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export async function getAuth() {
	const { contract } = loadContract()

	try {
		return await contract.getAuthContracts()
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export async function getVote() {
	const { contract } = loadContract()

	try {
		return await contract.getVoteContracts()
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}
