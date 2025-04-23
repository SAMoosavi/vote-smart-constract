import { JsonRpcProvider, Wallet, ethers } from 'ethers'
import { VoteCreator__factory } from '../typechain-types'

const RPC_URL = 'http://127.0.0.1:8545/'
const PRIVATE_KEY = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'

const provider = new JsonRpcProvider(RPC_URL)
const wallet = new Wallet(PRIVATE_KEY, provider)

async function main() {
	console.log('Deploying VoteCreator...')

	const factory = new VoteCreator__factory(wallet)
	const contract = await factory.deploy(ethers.parseEther('0.5'))

	await contract.waitForDeployment()

	return contract
}

main()
	.then((contract) => {
		console.log(`✅ Contract deployed at address: ${contract.target}`)
	})
	.catch((err) => {
		console.error('❌ Deployment failed:', err)
		process.exit(1)
	})
