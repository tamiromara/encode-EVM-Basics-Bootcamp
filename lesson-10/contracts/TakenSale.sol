//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MyToken} from "./MyERC20.sol";
import {MyNFT} from "./MyERC721.sol";

contract TokenSale is Ownable {
    uint256 public ratio; // ratio of ETH to tokens
    uint256 public price; // price of NFT in tokens
    MyToken public token; // address of the token contract
    MyNFT public nft; // addres of NFT contract

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

    // because this function is payable, anyone calling this funtion will be albe to pass a value
    function buy() public payable {
        //TODO
    }
}