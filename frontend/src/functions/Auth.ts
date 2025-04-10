import { ethers } from 'ethers'
import abi from '@/build/Auth.abi.json'
import { connect } from './Connector.ts'

function loadContract(contract_address: string): {
	provider: ethers.JsonRpcProvider
	wallet: ethers.Wallet
	contract: ethers.Contract
} {
	const { provider, wallet } = connect()

	const contract = new ethers.Contract(contract_address, abi, wallet)

	return { provider, wallet, contract }
}

export async function addUser(
	contract_address: string,
	username: string,
	password: string,
	email: string,
) {
	const { contract } = loadContract(contract_address)

	try {
		return contract.createUser(username, email, password, {
			gasLimit: 2152000,
		})

	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export async function getUsers(contract_address: string) {
	const { contract } = loadContract(contract_address)
	try {
		return await contract.get_users()
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}
