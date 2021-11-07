// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveUtility is ERC20 {
    constructor() ERC20("memos.live utility", "MLU") {
        _mint(msg.sender, 1000000 * 1000000000000000000);
    }

    function exchangeUtilityForNative(uint256 amount) {
        // if user have enough funds MATUC?
//        require
        // f contract have ebough funds MML
    }
}