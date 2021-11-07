// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function createToken(string memory tokenURI) public returns (uint) {
        //        require(utilityTokenAddress.balanceOf(_msgSender) > 0, "You need to have a utility tokens on your balance for minting,");
        //        utilityTokenAddress.transferFrom(_msgSender, 0x7eaDdde7f2F291C67BDe600dF6ff79849EE942bE, 1);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // function getBalances() public returns (uint) {
    //     return .length;
    // }
}