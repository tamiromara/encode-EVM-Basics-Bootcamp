## Test : uses a valid ERC20 as payment token

Whomever, the deployer since we used ownable permission?, is also going to send a valid ERC20 token and valid ERC721 NFT along with the `price` and `ratio`.



Import the ERC20 and ERC721 contracts : 

```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MyToken} from "./MyERC20.sol";
import {MyNFT} from "./MyERC721.sol";
```



We will add them as `global variables` in our smart contract and pass them into the `constructor` as input parameters :

```solidity
contract TokenSale is Ownable {
    uint256 public ratio;
    uint256 public price;
    MyToken public token;
    MyNFT public nft;
```

`MyToken` is a contract type, and `token` is a variable of that type.

`token` variable will hold a reference to a contract that conforms to the `MyToken` interface.



We will NOT redeploy the smart contracts inside the contract. Instead, we will pass their addresses as parameters into the constructor :

```solidity
    constructor(
        uint256 _ratio,	// represents ratio of ETH to tokens
        uint256 _price,	// represents price of of an NTF in tokens
        address _tokenAddress, // address of contract MyToken instance
        address _ntfAddress	// address of MyNFT contract instance
    ) Ownable(msg.sender) {
        ratio = _ratio;
        price = _price;
        token = MyToken(_tokenAddress);
        nft = MyNFT(_ntfAddress);
    }
```

NOTE: `_` in front of the variable name is a naming convention to indicate that this is a parameter. It helps differentiate between the parameters and state variables. 

`token = MyToken(_tokenAddress);` :

Using casting on the address, we're linking the ABI of `MyToken` token to the address specified in `_tokenAddress`. 

This shows the solidity compiler how to handle data and function calls made to `token`.

It uses the ABI to encode the function calls and decode the responses when interacting with SC.

Same goes for `MyNFT(ntfAddress);`



### What is the difference Contract between address and reference ?

**Contract Address** : 

- Unique identifier on Ethereum blockchain that points to specific deployed smart contract.
- When we want to locate and interact with the deployed contract on the blockchain.

**Contract reference** : 

- variable in our solidity code that allows us to interact with a specific contract, given its address. 
- A way to interact with the contract's functions and state without needing to know the implementation details.



```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MyToken} from "./MyERC20.sol";
import {MyNFT} from "./MyERC721.sol";

contract TokenSale is Ownable {
    uint256 public ratio;
    uint256 public price;
    MyToken public token; // attaching the ABI to the adderess ?
    MyNFT public nft;

    constructor(
        uint256 _ratio,
        uint256 _price,
        address _tokenAddress,
        address _ntfAddress
    ) Ownable(msg.sender) {
        ratio = _ratio;
        price = _price;
        token = MyToken(_tokenAddress);
        nft = MyNFT(_ntfAddress);
    }
}
```



## TokenSale.ts | Test File

```typescript
async function deployTokenSaleFixture() {
  const tokenSale = await viem.deployContract("TokenSale", [
    TEST_RATIO,
    TEST_PRICE,
    "0x000000000000000000000000000000000000000000000",
    "0x000000000000000000000000000000000000000000000",
  ]);
  return { tokenSale };
}
```

**How come we're able to pass an address which is a zero?**

Because the actual type of `_tokenAddress` is address if you look at the ABI (JSON FIle). Although `tokenAddress` is being treated like a contract inside our Token, it is actually defined as an address by the ABI.

The ABI is only concerned with the type. So if we passed the zero/null address, which is a special address. It is used as a placeholder representing the absence of an address. It can signify that the token has not been assigned to any owner or that the contract does not have a valid address. But when we try to do transfer or balanceOf the process will fail.



Lesson 10 Notes:

Testing:

- Snapshot to avoid repeating code, using fixture function `deployTokenSaleFixture()`

- Get a public client : `getPublicClient()`

- Get wallet clients `getWalletClients()`

- Deploy `MyToken` contract : `viem.deployContract("MyToken")`

- Deploy `MyNFT` contract: `viem.deployContract("MyNFT")`

- Create `TEST_RATIO` and `TEST_PRICE` constants for testing

- Deploy `TokenSale` contract and passing the correct input variables:

- ```typescript
  const tokenSale = await viem.deployContract("TokenSale", [
        TEST_RATIO,
        TEST_PRICE,
        token.address,
        nft.address,
      ]);
  ```

- `deployTakenSaleFixture()` should return the following values to be used by other tests:

- ```typescript
      return {
        publicClient,
        deployer,
        account1,
        account2,
        tokenSale,
        token,
        nft,
      };
  ```

  

When Contract is deployed : 

Define the ratio as provided in the parameter

Define the price as provided in the parameter









