import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";
import {
  impersonateAccount,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

const TEST_RATIO = 100n; //why n?
const TEST_PRICE = 10n;

describe("NFT Shop", async () => {
  async function deployTokenSaleFixture() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    const token = await viem.deployContract("MyToken");
    const nft = await viem.deployContract("MyNFT");
    const tokenSale = await viem.deployContract("TokenSale", [
      TEST_RATIO,
      TEST_PRICE,
      token.address,
      nft.address,
    ]);
    return {
      publicClient,
      deployer,
      account1,
      account2,
      tokenSale,
      token,
      nft,
    };
  }
  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const { tokenSale } = await loadFixture(deployTokenSaleFixture);
      const ratio = await tokenSale.read.ratio();
      expect(ratio).to.equal(TEST_RATIO);
    });

    it("defines the price as provided in parameters", async () => {
      const { tokenSale } = await loadFixture(deployTokenSaleFixture);
      const price = await tokenSale.read.price();
      expect(price).to.equal(TEST_PRICE);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const { tokenSale } = await loadFixture(deployTokenSaleFixture);
      const tokenAddress = await tokenSale.read.token(); // TODO : how's this returning an address ?
      const tokenContract = await viem.getContractAt("MyToken", tokenAddress);
      const totalSupply = await tokenContract.read.totalSupply();
      expect(totalSupply).to.eq(0n);
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      const { tokenSale } = await loadFixture(deployTokenSaleFixture);
      const nftAddress = await tokenSale.read.nft();
      const nftContract = await viem.getContractAt("MyNFT", nftAddress);
      // these are optional functions in NFT. TODO with required functions
      // it needs to be mintable and needs to be burned?
      const name = await nftContract.read.name();
      const symbol = await nftContract.read.symbol();
      expect(name).to.eq("MyNFT");
      expect(symbol).to.eq("NFT");
    });
  });
  describe("When a user buys an ERC20 from the Token contract", async () => {
    const TEST_ETH_PAYMENT_SIZE = parseEther("10"); // amount of eth we're sending

    it("charges the correct amount of ETH", async () => {
      const { tokenSale, account1, publicClient } = await loadFixture(
        deployTokenSaleFixture
      );
      const ethBalanceBefore = await publicClient.getBalance({
        address: account1.account.address,
      });
      const buyTokensTx = await tokenSale.write.buy({
        value: TEST_ETH_PAYMENT_SIZE,
        account: account1.account,
      });
      await publicClient.waitForTransactionReceipt({ hash: buyTokensTx });
      const ethBalanceAfter = await publicClient.getBalance({
        address: account1.account.address,
      });
      const diff = ethBalanceBefore - ethBalanceAfter;
      expect(diff).to.eq(TEST_ETH_PAYMENT_SIZE); //TODO
    });

    it("gives the correct amount of tokens", async () => {
      const tokenAmountBefore = 0; //TODO
      // TODO call the function here
      const tokenAmountAfter = 0; // TODO
      const diff = tokenAmountBefore - tokenAmountAfter;
      expect(diff).to.eq(TEST_ETH_PAYMENT_SIZE * TEST_RATIO); //TODO
    });
  });
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });
    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  });
  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  });
  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
