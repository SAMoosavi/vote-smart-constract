const path = require('path')
const fs = require('fs')
const solc = require('solc')

const contractsDir = path.resolve(__dirname, '../contracts')
const buildDir = path.resolve(__dirname, '../build')

// Clean up the build directory
fs.rmSync(buildDir, { recursive: true, force: true })
fs.mkdirSync(buildDir)

// Read all Solidity files in the contracts directory
const contractFiles = fs.readdirSync(contractsDir).filter((file) => file.endsWith('.sol'))

// Prepare input for the Solidity compiler
const input = {
	language: 'Solidity',
	sources: {},
	settings: {
		outputSelection: {
			'*': {
				'*': ['abi', 'evm.bytecode.object'],
			},
		},
	},
}

contractFiles.forEach((file) => {
	const filePath = path.resolve(contractsDir, file)
	const source = fs.readFileSync(filePath, 'utf8')
	input.sources[file] = { content: source }
})

// Compile the contracts
const output = JSON.parse(solc.compile(JSON.stringify(input)))

// Handle compilation errors
if (output.errors) {
	let hasErrors = false
	output.errors.forEach((err) => {
		console.error(err.formattedMessage)
		if (err.severity === 'error') {
			hasErrors = true
		}
	})
	if (hasErrors) {
		throw new Error('Compilation failed due to errors.')
	}
}

// Write the compiled contracts to the build directory
for (const file in output.contracts) {
	for (const contractName in output.contracts[file]) {
		const contract = output.contracts[file][contractName]
		const contractFileName = contractName.replace(':', '') + '.json'
		const contractPath = path.resolve(buildDir, contractFileName)
		const contractData = {
			abi: contract.abi,
			bytecode: contract.evm.bytecode.object,
		}
		fs.writeFileSync(contractPath, JSON.stringify(contractData, null, 2), 'utf8')
		console.log(`Compiled ${contractName} successfully.`)
	}
}
