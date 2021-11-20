// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemosLiveNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NFTMinted(uint256 tokenId);

    address private contractCreator;
    address public communityPoolAddress;

    ERC20 private utilityTokenContract;
    uint256 private initialCost;
    uint256 private costStep;

    constructor(
        string memory nft_name,
        string memory nft_ticker,
        ERC20 utility_token_address,
        uint256 initial_cost,
        uint256 cost_step,
        address community_pool_address
    ) ERC721(nft_name, nft_ticker) {
        contractCreator = msg.sender;
        utilityTokenContract = ERC20(utility_token_address);
        initialCost = initial_cost;
        costStep = cost_step;
        setCommunityPoolAddress(community_pool_address);
    }

    function setCommunityPoolAddress(address new_community_pool_address) public returns (address) {
        require(contractCreator == msg.sender, 'No no...');
        communityPoolAddress = new_community_pool_address;
        return communityPoolAddress;
    }

    function getCommunityPoolAddress() public view returns (address) {
        return communityPoolAddress;
    }

    function getCurrentCost() public view returns (uint) {
        uint256 currentTokenId = _tokenIds.current();
        uint256 currentCost = initialCost + (currentTokenId * costStep); // TODO: safemath?
        return currentCost;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        uint256 currentNFTCost = getCurrentCost();

        require(
            utilityTokenContract.balanceOf(msg.sender) > currentNFTCost,
            "You need to have enough utility tokens on your balance for minting,"
        );

        utilityTokenContract.transferFrom(msg.sender, communityPoolAddress, currentNFTCost);

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

         emit NFTMinted(newTokenId);

        return newTokenId;
    }
}