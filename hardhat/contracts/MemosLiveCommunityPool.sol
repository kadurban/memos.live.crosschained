// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveCommunityPool {
    address private contractCreator;
    ERC20 public utilityTokenContract;

    constructor(address utility_token_address) {
        contractCreator = msg.sender;
        utilityTokenContract = ERC20(utility_token_address);
    }

    function getPoolBalance() public view returns (uint) {
        return address(this).balance;
    }

    function distribute() public {
        require(contractCreator == msg.sender, 'No no...');


    }
}