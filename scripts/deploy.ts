import { ethers } from 'ethers'
import * as fs from 'fs'
import * as path from 'path'

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()

const RPC_URL = process.env.LOCAL_RPC_URL || 'http://127.0.0.1:7545'
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY

if (!PRIVATE_KEY) throw new Error('DEPLOYER_PRIVATE_KEY not set in .env file.')

const provider = new ethers.JsonRpcProvider(RPC_URL)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

async function main() {
	const contractPath = path.join(__dirname, '../build', 'VoteCreator.json')
	const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'))

	const factory = ethers.ContractFactory.fromSolidity(contractJson, wallet)

	console.log('Deploying contract...')
	const contract = await factory.deploy()

	console.log(`Contract deployed at address: ${contract.target}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
