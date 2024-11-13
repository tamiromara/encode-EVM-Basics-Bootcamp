import { viem } from "hardhat";
// Q:why importing these if already have viem imported?
import { toHex, hexToString, formatEther } from "viem"; // helper functions
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
  const publicClient = await viem.getPublicClient();
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  const [deployer] = await viem.getWalletClients();
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  // Deploying Ballot contract and initializing proposals:
  console.log("\nDeploying Ballot contract");
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  // Log the address of the deployed contract
  console.log("Ballot contract deployed to:", ballotContract.address);
  // Log the proposals:
  console.log("Proposals: ");
  for (let index = 0; index < PROPOSALS.length; index++) {
    // Retrieve the proposal from the contract using the index
    // proposal is an array of two elements: [name, voteCount]
    // name is a hex string
    // voteCount is a bigint
    const proposal = await ballotContract.read.proposals([BigInt(index)]);
    // Convert the returned proposal name from hex to string
    const name = hexToString(proposal[0], { size: 32 });
    // Log the index, name, and full proposal details
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
