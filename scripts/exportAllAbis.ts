import fs from 'fs'
import path from 'path'

const outputDir = path.join(__dirname, '../frontend/src/build')

/**
 * Recursively scans a directory for JSON files (ignoring '.dbg.json' files).
 * @param dir - The directory to scan.
 * @returns An array of file paths.
 */
function getAllContractJsonFiles(dir: string): string[] {
	let files: string[] = []

	const items = fs.readdirSync(dir)
	for (const item of items) {
		const fullPath = path.join(dir, item)
		const stat = fs.statSync(fullPath)

		if (stat.isDirectory()) {
			files = files.concat(getAllContractJsonFiles(fullPath))
		} else if (item.endsWith('.json') && !item.endsWith('.dbg.json')) {
			files.push(fullPath)
		}
	}

	return files
}

// Ensure the output directory exists
fs.mkdirSync(outputDir, { recursive: true })

const contractsDir = path.join(__dirname, '../artifacts/contracts')

// Get all JSON files from the contracts directory
const contractJsonFiles = getAllContractJsonFiles(contractsDir)

for (const jsonFile of contractJsonFiles) {
	const fileContent = fs.readFileSync(jsonFile, 'utf8')
	let contractJson: any

	try {
		contractJson = JSON.parse(fileContent)
	} catch (error) {
		console.error(`Error parsing JSON file: ${jsonFile}`, error)
		continue
	}

	const abi = contractJson.abi
	if (!abi) {
		console.warn(`No ABI found in ${jsonFile}`)
		continue
	}

	// Use the file name (minus extension) as the contract name.
	const contractName = path.basename(jsonFile, '.json')
	const outputPath = path.join(outputDir, `${contractName}.abi.json`)
	fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2))

	console.log(`✅ Exported ABI: ${contractName} → ${path.relative(process.cwd(), outputPath)}`)
}

const contractName = path.join(__dirname, '../typechain-types/index.ts')

const outputPath = path.join(outputDir, 'index.ts')
if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)

fs.symlinkSync(contractName, outputPath)
console.log(`✅ Exported Type: ${contractName} → ${path.relative(process.cwd(), outputPath)}`)
