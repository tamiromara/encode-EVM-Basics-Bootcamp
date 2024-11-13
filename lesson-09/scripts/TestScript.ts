import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, account1, account2] = await viem.getWalletClients();

  // Deploy the contract
  const tokenContract = await viem.deployContract("MyToken");
  console.log("");
  console.log(`Contract address  : ${tokenContract.address}`);
  console.log(`Contract deployer : ${deployer.account.address}`);
  // console.log(`Account 1         : ${account1.account.address}`);
  // console.log(`Account 2         : ${account2.account.address}`);

  // Fetch the initial total tokens supply
  const initialSupply = await tokenContract.read.totalSupply();

  // Fetch the role code
  const code = await tokenContract.read.MINTER_ROLE();
  console.log("Role Code         :", code);

  // Granting the MINTER_ROLE to account2
  const roleTx = await tokenContract.write.grantRole([
    code,
    account2.account.address,
  ]);
  await publicClient.waitForTransactionReceipt({ hash: roleTx });
  console.log("Role Tx           :", roleTx);

  // Minting 10 tokens to the deployer's account from account2
  const mintTx = await tokenContract.write.mint(
    [deployer.account.address, parseEther("10")],
    { account: account2.account }
  );
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
  console.log("Mint Tx           :", mintTx);

  // Fetching minted tokens data with Promise.all
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.read.name(),
    tokenContract.read.symbol(),
    tokenContract.read.decimals(),
    tokenContract.read.totalSupply(),
  ]);
  console.log("Name              :", name);
  console.log("Symbol            :", symbol);
  console.log("Decimals          :", decimals);
  console.log("Initial Supply    :", initialSupply);
  console.log("Total Supply      :", totalSupply);

  // Sending 2 tokens from the deployer's account to account1
  const tx = await tokenContract.write.transfer([
    account1.account.address,
    parseEther("2"),
  ]);
  await publicClient.waitForTransactionReceipt({ hash: tx });

  // Viewing the balances of the deployer and account1
  // const myBalance = await tokenContract.read.balanceOf([
  //   deployer.account.address,
  // ]);
  // console.log(`My Balance is ${myBalance} decimals units`);
  // const otherBalance = await tokenContract.read.balanceOf([
  //   account1.account.address,
  // ]);
  // console.log(`The Balance of Acc1 is ${otherBalance} decimals units`);

  //
  const myBalance = await tokenContract.read.balanceOf([
    deployer.account.address,
  ]);
  console.log(`My Balance        : ${formatEther(myBalance)} ${symbol}`);

  const otherBalance = await tokenContract.read.balanceOf([
    account1.account.address,
  ]);
  console.log(`Account 1 Balance : ${formatEther(otherBalance)} ${symbol}`);
  console.log("");

  // An example of a token using 8 decimals instead of 18 and how to address this
  // using formatUnits function
  const myBalance2 = await tokenContract.read.balanceOf([
    deployer.account.address,
  ]);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
