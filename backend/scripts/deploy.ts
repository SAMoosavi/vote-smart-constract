import Web3 from "web3";
import { AbiItem } from "web3-utils";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("DEPLOYER_PRIVATE_KEY not set in .env file.");
}

const web3 = new Web3(RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const deployContract = async (contractName: string) => {
  const buildPath = path.resolve(__dirname, "../build", `${contractName}.json`);
  const contractJson = JSON.parse(fs.readFileSync(buildPath, "utf8"));
  const { abi, bytecode } = contractJson;

  const contract = new web3.eth.Contract(abi  as AbiItem[]);

  const deployOptions = {
    data: "0x" + bytecode,
    arguments: [], // Add constructor arguments if needed
  };

  const deployTransaction = contract.deploy(deployOptions);
  const gas = await deployTransaction.estimateGas();
  const gasPrice = await web3.eth.getGasPrice();

	const options = {
		data: deployTransaction.encodeABI(),
		gas,
		gasPrice,
		from: account.address, // Ensure the from address is set
	};

	const signed = await web3.eth.accounts.signTransaction(options, PRIVATE_KEY);
	const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction as string);
	console.log(`Contract deployed at address: ${receipt.contractAddress}`);
};

const main = async () => {
  try {
    await deployContract("VoteCreator"); // Replace with actual contract name
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

main();
