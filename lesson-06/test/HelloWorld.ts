import { viem } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("HelloWorld", function () {
  async function deployContractFixture() {
    const publicClient = await viem.getPublicClient();
    const [owner, otherAccount] = await viem.getWalletClients();
    const helloWorldContract = await viem.deployContract("HelloWorld");
    return {
      publicClient,
      owner,
      otherAccount,
      helloWorldContract,
    };
  }

  // Test case 1
  it("Should give a Hello World", async function () {
    const { helloWorldContract } = await loadFixture(deployContractFixture);
    const helloWorldText = await helloWorldContract.read.helloWorld();
    expect(helloWorldText).to.equal("Hello World");
  });

  // Test case 2
  it("Should set owner to deployer account", async function () {
    const { helloWorldContract, owner } = await loadFixture(
      deployContractFixture
    );
    const contractOwner = await helloWorldContract.read.owner();
    expect(contractOwner.toLowerCase()).to.equal(owner.account.address);
  });

  // Test case 3
  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    const { helloWorldContract, otherAccount } = await loadFixture(
      deployContractFixture
    );
    const helloWorldContractAsOtherAccount = await viem.getContractAt(
      "HelloWorld",
      helloWorldContract.address,
      { client: { wallet: otherAccount } }
    );

    // expect() is a function that takes a promise and returns a promise ?
    // helloWorldContractAsOtherAccount.write.transferOwnership() returns a promise
    // helloWorldContractAsOtherAccount is a contract instance created with otherAccount as the client.
    // Meaning any interaction with this contract instance will come from otherAccount.
    // write is a function provided by viem for writing to the blockchain.
    // transferOwnership is a function that is part of the HelloWorld contract interface.
    // It takes an array of addresses as an argument.
    // otherAccount.account.address is the address of the account that otherAccount controls.
    // The transferOwnership function is called with otherAccount's address as the argument.
    // expect() is called with the promise returned by helloWorldContractAsOtherAccount.write.transferOwnership()
    // to.be.rejectedWith is a chai matcher that checks if the promise was rejected with a specific error message.
    await expect(
      helloWorldContractAsOtherAccount.write.transferOwnership([
        otherAccount.account.address,
      ])
    ).to.be.rejectedWith("Caller is not the owner");
  });

  // Test case 4
  it("Should execute transferOwnership correctly", async function () {
    const { publicClient, helloWorldContract, owner, otherAccount } =
      await loadFixture(deployContractFixture);
    const txHash = await helloWorldContract.write.transferOwnership([
      otherAccount.account.address,
    ]);
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    expect(receipt.status).to.equal("success");
    const contractOwner = await helloWorldContract.read.owner();
    expect(contractOwner.toLowerCase()).to.equal(otherAccount.account.address);
    // It is important to check all relevant indirect effects in your tests
    const helloWorldContractAsPreviousAccount = await viem.getContractAt(
      "HelloWorld",
      helloWorldContract.address,
      { client: { wallet: owner } }
    );
    await expect(
      helloWorldContractAsPreviousAccount.write.transferOwnership([
        owner.account.address,
      ])
    ).to.be.rejectedWith("Caller is not the owner");
  });

  // Test case 5
  it("Should not allow anyone other than owner to change text", async function () {
    await loadFixture(deployContractFixture);
  });

  // Test case 6
  it("Should change text correctly", async function () {
    await loadFixture(deployContractFixture);
  });
});
