
# Ethereum Voting DApp (Votereum)

This is a decentralized voting application built on the Ethereum blockchain.  
It allows users to log in automatically using their `public_key` and a `digital signature`, eliminating the need for traditional authentication methods.

## Features

- Fully decentralized voting system
- Login using Ethereum wallet (`public_key + digital_signature`)
- Secure and transparent vote handling via smart contracts
- Separate backend and frontend architecture

---

## Getting Started

To run this project locally, follow the steps below:

### 1. Start Local Ethereum Node

Make sure you have a local Ethereum test node running:

```bash
npm i
npm run node
````

This usually runs with [Hardhat](https://hardhat.org/)

---

### 2. Deploy Smart Contracts

After the node is up, deploy the smart contracts to the local Ethereum network:

```bash
npm run deploy
```

This will compile and deploy all required smart contracts to the blockchain.

---

### 3. Start Backend Server

Navigate to the backend directory and start the server:

```bash
cd backend
npm i
npm run run:server
```

This will start the API server which communicates with the smart contracts.

---

### 4. Start Frontend Development Server

Open a new terminal and navigate to the frontend directory:

```bash
cd ../frontend
npm i
npm run dev
```

This will launch the frontend in development mode, typically accessible at `http://localhost:3000`.

---

## Requirements

* Node.js >= 18.x
* npm or yarn
* Hardhat

---

## License

This project is licensed under the MIT License.


