import Web3, { Contract, type AbiFragment, type Web3Account } from 'web3'
import contractJson from '../../../../backend/build/VoteCreator.json'

function connect(): { web3: Web3; account: Web3Account } {
	const RPC_URL = 'http://127.0.0.1:8545'
	const PRIVATE_KEY = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'

	const web3 = new Web3(RPC_URL)

	const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY as string)
	web3.eth.accounts.wallet.add(account)
	web3.eth.defaultAccount = account.address

	console.log('Connected to:', RPC_URL)

	return { web3, account }
}

function loadAbi(): { web3: Web3; account: Web3Account; contract: Contract<AbiFragment[]> } {
	const { web3, account } = connect()

	const abi = contractJson.abi

	const CONTRACT_ADDRESS = '0x73511669fd4de447fed18bb79bafeac93ab7f31f'
	const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)

	return { web3, account, contract }
}

export const createAuth = async (name: string) => {
	const { web3, account, contract } = loadAbi()

	try {
		const value = web3.utils.toWei('1', 'ether')

		const tx = await contract.methods.createAuth(name).send({
			from: account.address,
			gas: '2152000',
			value,
		})

		console.log('Transaction Hash:', tx)
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export const createVote = async (auth_address: string, name: string, candidate_names: string[]) => {
	const { web3, account, contract } = loadAbi()

	try {
		const value = web3.utils.toWei('0.5', 'ether')

		const tx = await contract.methods.createVote(auth_address, name, candidate_names).send({
			from: account.address,
			gas: '2152000',
			value,
		})

		console.log('Transaction Hash:', tx)
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}

export async function getAuth() {
	const { web3, account, contract } = loadAbi()

	try {
		const result = await contract.methods.getAuthContracts().call()
		console.log(result)
	} catch (error) {
		console.error('Error calling contract:', error)
	}
}
