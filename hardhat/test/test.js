const { expect } = require("chai");
const { ethers } = require("hardhat");

let utilityContract;
let communityPoolContract;
let nftContract;

describe('memos.live economy tests', function () {
  describe('Contracts deployment', () => {
    it('Deploys Utility token contract', async function () {
      utilityContract = await ethers.getContractFactory('MemosLiveUtility');
      utilityContract = await utilityContract.deploy('Memos Live Utility', 'MLU_TEST');
      await utilityContract.deployed();
    });
    it('Deploys Community Pool contract', async () => {
      communityPoolContract = await ethers.getContractFactory('MemosLiveCommunityPool');
      communityPoolContract = await communityPoolContract.deploy(utilityContract.address);
      await communityPoolContract.deployed();
    });
    it('Deploys NFT contract', async () => {
      nftContract = await ethers.getContractFactory('MemosLiveNFT');
      nftContract = await nftContract.deploy(
        'memos.live NFT',
        'MEMOSLIVE_TEST',
        utilityContract.address,
        "1000000000000000000",
        "1000000000000000",
        communityPoolContract.address
      );
      await nftContract.deployed();
    });
  });


  describe('Economy functions', () => {
    it('Checks that "current cost" for NFT is equals to 1', async () => {
      const currentCost = toReadableBalance(await nftContract.getCurrentCost());
      expect(currentCost).to.equal(1);
    });


    it('Ensure that it is not possible to mint NFT if there is not enough MLU tokens', async () => {
      const [
        contractCreator,
        user1
      ] = await ethers.getSigners();

      const contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);
      const user1UtilityBalance = await utilityContract.balanceOf(user1.address);

      console.log('+++')
      console.log(toReadableBalance(contractCreatorUtilityBalance))
      console.log(toReadableBalance(user1UtilityBalance))

      const tokenId = await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      console.log('===')
      console.log(tokenId)
    });


    // it('Check that balance increasing after single NFT creation', async () => {
    //
    // });


    // it('Should distribute all MLU tokens to the NFT holders according quantity of NFTs on balance', async () => {
    //
    // });


    //   it('Checks that community pool address can be changed by "contract creator" only', async () => {
    //
    //   });


    //   it('Should not allow to mint NFT if not enough MLU tokens to pay', async () => {
    //
    //   });


    //   it('Should pay "current cost" in MLU token and mint an NFT and check if it really minted', async () => {
    //
    //   });


    //   it('Should increase "current cost" after single NFT creation', async () => {
    //
    //   });


    //   it('Mint 1000 MEMOS tokens and ensure current cost is correct', async () => {
    //
    //   });
  });
})

function toReadableBalance(hex) {
  return Number(BigInt(hex) / BigInt(Math.pow(10, 18)));
}
