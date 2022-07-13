// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NFTMinted(uint256 tokenId);

    address private contractCreator;
    address public poolAddress;
    uint256 private initialCost;
    uint256 private costStep;

    constructor(
        string memory nft_name,
        string memory nft_ticker,
        uint256 initial_cost,
        uint256 cost_step,
        address pool_address
    ) ERC721(nft_name, nft_ticker) {
        contractCreator = msg.sender;
        initialCost = initial_cost;
        costStep = cost_step;
        setPoolAddress(pool_address);
    }

    function setPoolAddress(address new_pool_address) public returns (address) {
        require(contractCreator == msg.sender, 'No no...');
        poolAddress = new_pool_address;
        return poolAddress;
    }

    function getPoolAddress() public view returns (address) {
        return poolAddress;
    }

    function getCurrentCost() public view returns (uint) {
        uint256 currentTokenId = _tokenIds.current();
        uint256 currentCost = initialCost + (currentTokenId * costStep);
        return currentCost;
    }

    function createToken(string memory tokenURI) public payable returns (uint) {
        uint256 currentNFTCost = initialCost;

        require(
            msg.value >= currentNFTCost,
            "Current cost is bigger than amount you sent"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(newTokenId);

        return newTokenId;
    }
}