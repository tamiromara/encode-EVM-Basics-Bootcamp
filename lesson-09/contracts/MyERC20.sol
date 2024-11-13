// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Inherit 
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC20, AccessControl {
    // MINTER_ROLE is a unique identifier/tage used to specify which address(s)
    // are allowed to mint new tokens
    //keccak256 is used to create a unique immutable identifier for the role.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    constructor() ERC20("MyToken", "MTK") {
        // deployer is given an initial supply of tokens
        // and is granted the default admin role
        _mint(msg.sender, 10 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    // mint function allows the accounts with MINTER_ROLE to mint new tokens to a specified address
    // onlyRole is a modifier that checks if the caller has the MINTER_ROLE
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}