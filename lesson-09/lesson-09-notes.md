ERC20

ERC721

The only thing on Ethereum of value is Ether. Anything else is Data.

These ERCs similar to the above helps us track the accounting balances and transactions for other fungible and non fungible assets in the blockchain outside of ether. TODO

EIPs are community derived

 

**What is ERC20 Token ?**

Exists on the Ethereum platform. The platform can be divided into EVM (running smart contracts) and blockchain (storing transactions).

Tokens live on the blockchain and they aren't independent. They rely on the platform and blockchain .

The only thing of value on Ethereum is Ether. But tokens can also be used as currency, shares, loyalty points, etc.



Token can be created by smart contracts. 

Smart contracts can create, manage and track transactions of tokens

To get tokens, you have to send ether to the smart contract.



Problems:

Once contract deployed it can't be changed.

Interoperability: each token can be different from other tokens, and ignorer for them to be available on a exchange, the exchange will have to write custom code so that they can talk to your contract and allow people to trade.

This goes for wallet providers as well, supporting different tokens and assets would be very difficult and time consuming.



**Solution:**

Ethereum Request for Comments

community suggested ERC20: is a guideline or standard for when you want to create tokens. Its only a guideline.

Defines 6 mandatory functions that your contract should implement, and 3 optional ones.

To use the ERC20 standard in your smart contract, you have to implement its interface.

Optional:

- `name` : returns the 
- `symbol`
- `decimals` : how dividable the token is ? By specifying how many decimals its should support.

Mandatory:

- `totalSupply` : when this limit is reached, the smart contract will refuse to create more tokens.
- `balanceOf` : returns how much tokens a given address has.
- `transfer` : takes some tokens from `totalSupply` and gives them to some user.
- `transferFrom` : used to transfer tokens between any two users that already have them.
- `approve`  : verifies that your contract can give a certain amount of token to a user, taken into account the total supply
- `allowance` : verifies that a user has enough balance to send tokens to someone else.

Extending the ERC20 standard with ERC223 to mitigate some of the issues with ERC20

TODO:

- lookup some of the well known issues with ERC20
- Learn more about ERC223



## NFT

Type of digital assets.

Whenever you're buying an NFT, you're buying the rights to that asset.

Non-fungible: meaning it: 

​	can't be changed once its created. 

​	Can't be split, and

​	It must be distinguishable from something else.

Essentially, a token is a piece of <u>data</u> that you own.

NFT is a token that you own, that doesn't change over time.

NFT is a piece of data that is own by and address. So, whomever owns the "password" to that address owns that piece of data.

Important: 

When buying an NFT, you're buying a piece of code that points to server that hosts image/gif, etc. The server COULD CHANGE and the imaging gif COULD CHANGE.

Because what you essentially own is the piece of data not the access to the server.

### What makes NFTs Valuable?

### First

Like bitcoin, or for example the first NFT in the United States might have a value. First edition Pokemon cards.

### Utility

Read world benefit. If you buy NFT of someone famous for example, you get access to him or his shows or certain discounts forever.

### Unique or Rare

Monalisa. Person important creating something unique and limited.

### Ownership History

Something that has been owned by someone important.

---

## Class 9 Video :

TODO: move notes from comments to `readMe.md`

What is EIPs?

Ethereum Improvement Proposals :  are proposals for improving Ethereum that undergoes community review and feedback before they are accepted or implemented.

What are RFC?

Request For Comment: application level standard and conventions. 



### ERC20 : 

ERC20 token contract keeps track of fungible tokens: each token is exactly the same as any other token. NO token have special rights or behavior.

This makes them a great medium of exchange currency, voting rights, staking and many more. 

`decimals` field is provided to mitigate solidity's limitation when it comes to integer whole numbers. This is achieved by using large integer values. For example, to represent `5 MTK` we use `50`. So a transfer of `1.5 MTK` will be represented as `15`.

`decimals` is only used for display purposes!

The default value of `decimals` in ERC20 is `18`.



### ERC721 :

Standard for representing ownership of non-fungible tokens, where each token is unique.

ERC721 more complex than ERC20 and is split across multiple contract. 



### Using openzeppelin :

Instead of rewriting smart contracts from scratch, specially if we're implementing a standard like ERC20 or ERC721 then we can import the openzeppelin library and inherit behaviors inside our smart contract.

Install and import openzeppelin library  : 

`npm install --save-dev @openzeppelin/contracts`



## Strategy 

In `TestScript.ts` : 

### Configured to import the necessary libraries :

`import { viem } from "hardhat";`

`import { parseEther, formatEther } from viem;` 

`parseEther` : provides a convenient way to convert readable Ether values (in string) into `wei` format.

On Ethereum, for computational accuracy uses `wei` which is the smallest unit of Ether.

1 Ether = 1* 10**18 =1×10¹⁸ = 1,000,000,000,000,000,000 wei.

`formatEther` on the other hand, converts  a given amount to wei back into a human-readable Ether value



### Get public client to interact with the blockchain :

`const publicClient = await viem.getPublicClient();` 

`getPublicClient()` is expected to return a *promise* that resolves to a to a client object.

We can then use to interact with the blockchain in a read-only mode. `publicClient` is therefore going to allow the script to interact with the blockchain without making state changes.



### Get three wallet addresses and mark the first as a deployer : 

`const [deployer, account1, account2] = await viem.getWalletClients();`

`getWalletClients()` returns an array of wallet clients, each representing and ethereum address that can interact and change the state of the blockchain (<u>*because wallet clients can sign transactions? This is how state is changed on chain?*</u>). 



In `hardhat.config.ts`

Should be configured to point to the appropriate target network.

```typescript
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

console.log("Key Check: ", deployerPrivateKey.length);

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      // URL of the Ethereum Sepolia network public node
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
  },
};
```



### Deploying with hardhat helper function : 

```typescript
const tokenContract = await viem.deployContract("MyToken");
console.log(`Contract deployed at ${tokenContract.address}`);
```

`deployContract("MyToken")` returns an instance of the deployed contract.

The function automates the deployment process of smart contracts by abstracting the complexities. When passing the contract name string, it uses the contract's **ABI** and **bytecode** to deploy the contract to the blockchain. 

Both ABI and Bytecode are generated once the contract is compiled. They are derived from the solidity contract and stored in `artifacts` folder ?



### Fetching the total supply : 

```typescript
const totalSupply = await tokenContract.read.totalSupply();
console.log({ totalSupply });
```

`read` property of viem that provides access to read-only functions that don't change the state of the blockchain ( in the contract that are marked with *view* or *pure*).

`totalSupply` is a (mandatory) function of the ERC20 token standard. It returns the total supply of tokens that have been issues by the contract. This includes all tokens within the contract or in circulation.



### Implementing initial supply : 

```solidity
constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10 * 10 ** decimals());}
```



`constructor()` functions in solidity is a special function that's called only once when the contract is first deployed.

`ERC20("MyToken", "MTK")` calls the constructor of the inherited ERC20 contract, which is part of the openzeppelin library.

`"MyToken", "MTK"` arguments initialize the token with the name `MyToken` and symbol `MTK`.

`msg.sender` is the address of account deploying (calling) the contract. 

`10` the initial number of tokens in whole units.

`10 ** decimals()` converts the tokens amount into the smallest units of the toke (wei for Ether). `decimals()` returns `18` by default, so the outcome will be `10000000000000000000`

`_mint()` internal function of the inherited ERC20 contract, that mints (creates) tokens and assign them to a specific address. The initial supply is sent directly to the wallet of the deployer.



 ### Implementing RBAC for supply control :

```solidity
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
```

Import `AccessControl`

`bytes32 public constant MINTER_ROLE` declares a public constant identifier called `MINTER_ROLE` of 32 bytes (256 bits) which will store the returned hash of the string `MINTER_ROLE`. 

**Why use `keccak256` to generate `MINTER_ROLE` ?** 

- Compatibility with AccessControl, as it uses `bytes32` identifiers for roles.
- Gas efficiency: solidity handles `bytes32` values very well.



### Handling Roles : 

`const code = await tokenContract.read.MINTER_ROLE();`

`read.MINTER_ROLE()` : read-only function that retrieves the unique identifier (hash) for the `MINTER_ROLE`. 



### Minting tokens without MINTER_ROLE : 

Since the deployer receives the DEFAUL_ADMIN_ROLE, he needs to assign `account2` a `role` before it is able to mint tokens. 

That's why the below code will give the error `*AccessControlUnauthorizedAccount*`

```typescript
const mintTx = await tokenContract.write.mint(
    [deployer.account.address, parseEther("10")],
    { account: account2.account }
);
await publicClient.waitForTransactionReceipt({ hash: mintTx });
```

`const mintTx = await tokenContract.write.mint(` : This line calls `mint` function from the deployed `tokenContract`. The `write` object allows write operations on the contract.

`mintTx` stores the transaction hash returned from `tokenContract.write.mint`.

When `await publicClient.waitForTransactionReceipt({ hash: mintTx }); `:

1. Look for a specific transaction with hash `mintTx`.
2. Wait until the transaction is complete (block mined).
3. Return the transaction receipt once it has been confirmed.



### Minting tokens with the proper MINTER_ROLE : 

Place this code before above code block so that account2 is granted a role before minting.

``` typescript
const roleTx = await tokenContract.write.grantRole([
  code,
  account2.account.address,
]);
await publicClient.waitForTransactionReceipt({ hash: roleTx });
```

`grantRole` part of `AccessControl` library in OpenZeppelin. It assigns a specific role to an address. 

`code` is the identifier for the role being granted. `code` is expected to be the hashed identifier for the role. 



### Fetching token data with `Promise.all()`

```typescript
const [name, symbol, decimals, totalSupply] = await Promise.all([
  tokenContract.read.name(),
  tokenContract.read.symbol(),
  tokenContract.read.decimals(),
  tokenContract.read.totalSupply(),
]);
console.log({ name, symbol, decimals, totalSupply });
```

`Promise.all()` takes an array of asynchronous operations and waits for all of them to complete. It allows the code to execute in parallel which is more efficient than waiting for each request to complete before moving to the next one.



### Sending Transactions : 

```typescript
const tx = await tokenContract.write.transfer([
  account1.account.address,
  parseEther("2"),
]);
await publicClient.waitForTransactionReceipt({ hash: tx });
```

`parseEther` converts the string 2 into the smallest denomination of the token : 

2 tokens converted to 10 * 10**18 = 2000000000000000000



### Viewing the Balance : 

```typescript
const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
console.log(`My Balance is ${myBalance} decimals units`);
const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
console.log(
  `The Balance of Acc1 is ${otherBalance} decimals units`
);
```



### View converted balances with decimals conversion :

```typescript
import { parseEther, formatEther } from "viem";
...
const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
console.log(`My Balance is ${formatEther(myBalance)} ${symbol}`);
const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
console.log(
  `The Balance of Acc1 is ${formatEther(otherBalance)} ${symbol}`
);
```

`balanceOf` is an ERC20 standard function that returns the token balance of a specific address.

`[deployer.account.address]` is being passed as an array because view accept function arguments as arrays.



## Understanding Events :























