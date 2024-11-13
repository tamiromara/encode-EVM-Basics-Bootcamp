### Setup a new project folder using files from the previous Hardhat project:

Inside the project directory:

- Copy the following into the new project directory: `.env`, `.gitignore`, `.mocharc.json`, `hardhat.config.ts`, `package.json` and `tsconfig.json`
- Run `npm install`. This installs the node modules.
- Create the following folders: `contracts`, `scripts`, and `test` (yes, test NOT tests).
- Create `Ballot.sol` file.
- Create `Ballot.ts` file.
- Run `npx hardhat compile`



# Begin Class 08

## Running Scripts with hardhat & ts-node

### What is a script and why use it if we already can do is with mocha?

Mocha is a suite that is used for testing. It can be used along other tools.

Scripts are bare-bone scripts that performs single shot operations. It uses node or ts-node.

We can surely run the scripts from the test suite like `npx hardhat test ./scripts/Test.ts` 

But that's the not the whole point of scripts. We want to keep scripts simple and perform a single or related tasks together? //TODO

`.ts` file is not executable. It will be run by node in our example



Hardhat allows us to use Typescript in writing: *config*, *tasks*, *scripts* and *tests*.





Deploying Contract using 

```typescript
// The idea is having one function declared, then called!
// We're catching errors since this is an async function it might causes issues
// TODO : understand asynchronous and catching more
import { viem } from "hardhat";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```



## Personal Notes on L08 :

Import the the `view` library as we will  use it to deploy and interact with the contract: 

```solidity
import { viem } from "hardhat";
import { toHex, hexToString, formatEther } from "viem"; // more precise importing
```



Initializing the proposals array with 3 proposals, which will be used to initialize the Ballot contract.

```solidity
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
```



Logs a formatted string with the proposal number and the proposal name.

When formatting the string we use single quotes rather than double quotes.

forEach() method  iterate over the PROPOSALS array. 

It takes a callback function as an argument and its executed for each element in the array.

`element` is the current proposal.

`index` is the position of the current proposal in the array by its index.

```solidity
async function main() {
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
```



## Connecting to public blockchain :

If you run the code below without configuring the environment `.env` the smart contract will be deployed using an address provided by hardhat (is it the address from the list of addresses?)

`run hardhat run ./scripts/DeployWithHardhat.ts --network sepolia`

The hardhat documentation uses `.vars` for its example. 

Environment variables are used to configure settings like API keys, Secret tokens without hard-coding them, database urls, etc. 

We can have different environment variables for different scenarios (testing, production).

To deploy with our own account wallet address, we have to add the variables at `.env` file :

For example: `ALKHEMY_API_KEY`, `PRIVATE_KEY`



Install `dotenv` package :

`npm install dotenv`

Import the `dotenv` package into your script : 

```solidity
Import * as dotenv from "dotenv";
dotenv.config();
```





Snapshot of `DeployWithHardhat.ts` : 

```solidity
import { viem } from "hardhat";
import { toHex, hexToString, formatEther } from "viem";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
  console.log("Getting chain info...");
  const publicClient = await viem.getPublicClient();
  const blockNumber = await publicClient.getBlockNumber();
  console.log("\nLast block number:", blockNumber);
  const [deployer] = await viem.getWalletClients(); // TODO: what is this?
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  console.log("Contract address:", ballotContract.address);
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Using ts-node (without hardhat): 

Improvements to the code (passing arguments to scripts from terminal) :

Instead of hard coding the array and its elements in script file, it'd be suitable if we can pass it as an argument into the command line while executing the script.

With hardhat we can only do it this way:

`npc hardhat run ./scripts/DeployWithHardhat.ts "arg1" "arg2" "arg3"`

Instead we can use `ts-node` with the `--files` flag to pass arguments into the script from the terminal:

`npx ts-node --files ./scripts/ScriptName.ts --network sepolia argOne argTwo`

## Using view (without hardhat) : 

Copy code into a new script `DeployWithViem.ts`

We will also read the information from within the script itself (no use of `hardhat.config.ts`)

We replaced hardhat by doing the configurations ourselves, everything inside the script files itself.





# Week 2 Project

- Develop and run scripts for “Ballot.sol” within your group to 
  - give voting rights, 
  - casting votes,
  -  delegating votes and 
  - querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed



Copy filles.

Install npm : `npm install`

`npx hardhat compile`



Scripts:

- Checking proposals?
- Give Right to Vote
- Delegate
- Voting
- Check the winner



Steps 1: Deploy `Ballot.sol` smart contract into testate and extract its address.

Step 2: `getPublicClient()` to interact with the blockcian

Step 3: get the current blockchain number







# Class 9

What is an ERC?







