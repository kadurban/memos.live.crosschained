// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveUtility is ERC20 {
    string tokenName;
    string tokenTicker;
    address private contractCreator;

    constructor(
        string memory token_name,
        string memory token_ticker
    ) ERC20(token_name, token_ticker) {
        contractCreator = msg.sender;
        _mint(address(this), 990000 * 10**18);
        _mint(msg.sender, 10000 * 10**18); // talented producers giveaways to
    }
}