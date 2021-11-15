// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveUtility is ERC20 {
    string tokenName;
    string tokenTicker;

    constructor(
        string memory token_name,
        string memory token_ticker
    ) ERC20(token_name, token_ticker) {
        _mint(msg.sender, 100000 * 10**18); // talented producers giveaways pool
    }
}