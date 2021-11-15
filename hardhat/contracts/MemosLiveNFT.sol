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

    // event CardMinted(address indexed);

    address private contractCreator;
    address public communityPoolContract;

    ERC20 private utilityTokenContract;
    uint256 private initialCost;
    uint256 private costStep;

    constructor(
        string memory nft_name,
        string memory nft_ticker,
        ERC20 utility_token_address,
        uint256 initial_cost,
        uint256 cost_step
    ) ERC721("memos.live - Community-driven memorable NFT collection", "MEMOSLIVE_TEST") {
        contractCreator = msg.sender;
        utilityTokenContract = ERC20(utility_token_address);
        initialCost = initial_cost;
        costStep = cost_step;
    }

    function setCommunityPoolAddress(address pool_address) public returns (address) {
        require(contractCreator == msg.sender, 'No no...');
        communityPoolContract = pool_address;
        return communityPoolContract;
    }

    function getCurrentCost() public view returns (uint) {
        uint256 currentTokenId = _tokenIds.current();
        uint256 currentCost = initialCost + (currentTokenId * costStep); // TODO: safemath?
        return currentCost;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        // uint256 currentTokenId = _tokenIds.current();
        uint256 currentNFTCost = getCurrentCost();

        require(
            utilityTokenContract.balanceOf(msg.sender) > currentNFTCost,
            "You need to have a utility tokens on your balance for minting,"
        );

        utilityTokenContract.transfer(communityPoolContract, currentNFTCost);

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // emit CardMinted(newTokenId);

        return newTokenId;
    }
}