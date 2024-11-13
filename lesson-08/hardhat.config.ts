import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
// Load environment variables from the .env file into process.env
// we removed it from here and moved it to scripts/DeployWithViem.ts
// import * as dotenv from "dotenv";
// dotenv.config();

// Q: how to add a backup for etherscan api key?
const providerApiKey = process.env.ETHERSCAN_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.drpc.org/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log(account.account.address);
  }
});

export default config;
