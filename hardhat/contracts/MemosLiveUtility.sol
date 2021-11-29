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
        _mint(address(this), 87777777 * 10**18);
        _mint(msg.sender, 1111111 * 10**18); // talented/trusted producers giveaways for marketing and user engagement
    }
}