import { ethers } from 'ethers'
import contractJson from '../../build/VoteCreator.json'
import { connect } from './Connector.ts'


function loadContract(): { provider: ethers.JsonRpcProvider; wallet: ethers.Wallet; contract: ethers.Contract } {
	const { provider, wallet } = connect()

	const abi = contractJson.abi
	const CONTRACT_ADDRESS = '0xC469e7aE4aD962c30c7111dc580B4adbc7E914DD'
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
