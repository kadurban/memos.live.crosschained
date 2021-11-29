const { expect, assert } = require("chai");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");

let utilityContract;
let nftContract;

let costStep = "10000000000000000";

describe('memos.live economy tests', function () {
  describe('Contracts deployment', () => {
    it('Deploys Utility token contract', async function () {
      utilityContract = await ethers.getContractFactory('MemosLiveUtility');
      utilityContract = await utilityContract.deploy('Memos Live Utility', 'MLU_TEST');
      await utilityContract.deployed();
    });
    it('Deploys NFT contract', async () => {
      const [,,,,,communityPoolAccount] = await ethers.getSigners();

      nftContract = await ethers.getContractFactory('MemosLiveNFT');
      nftContract = await nftContract.deploy(
        'memos.live NFT',
        'MEMOSLIVE_TEST',
        utilityContract.address,
        "1000000000000000000",
        costStep,
        communityPoolAccount.address
      );
      await nftContract.deployed();
    });
  });


  describe('Economy functions', () => {
    it('Checks that "current cost" for NFT is equals to 1000000000000000000', async () => {
      const currentCost = await nftContract.getCurrentCost();
      expect(toReadableBalance(currentCost._hex)).to.equal(1);
    });


    it('Contract creator set 5 MLU approved to spend by NFT contract', async () => {
      const [
        contractCreator
      ] = await ethers.getSigners();
      const testApprovalValue = BigInt(5 * 1000000000000000000);
      await utilityContract.approve(nftContract.address, testApprovalValue);
      const currentAllowance = await utilityContract.allowance(contractCreator.address, nftContract.address);
      expect(currentAllowance).to.equal(testApprovalValue);
    });


    it('Mint 1 NFT by contract creator', async () => {
        const [
          contractCreator
        ] = await ethers.getSigners();
        await nftContract.createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
    });


    it('Checks that balances of community pool and contract creator are changed after minting of 1 NFT', async () => {
      const [ contractCreator,,,,,communityPoolAccount ] = await ethers.getSigners();

      let contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);
      let communityPoolContractBalance = await utilityContract.balanceOf(communityPoolAccount.address);

      expect(toReadableBalance(contractCreatorUtilityBalance._hex)).to.equal(111110);
      expect(toReadableBalance(communityPoolContractBalance._hex)).to.equal(1);
    });


    it('Mint 3 more NFT by contract creator and ensure correct current NFT cost, contract creator balance and community pool size', async () => {
      const [ contractCreator,,,,,communityPoolAccount ] = await ethers.getSigners();
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');

      const currentNftCost = await nftContract.getCurrentCost();
      let communityPoolContractBalance = await utilityContract.balanceOf(communityPoolAccount.address);
      let contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);

      expect(toReadableBalance(currentNftCost._hex)).to.equal(1.04);
      expect(toReadableBalance(communityPoolContractBalance._hex)).to.equal(4.06);
      expect(toReadableBalance(contractCreatorUtilityBalance._hex)).to.equal(111106.94);
    });


    it('Checks that it is not possible to mint 1 more NFT because allowance is too small', async () => {
      const [
        contractCreator
      ] = await ethers.getSigners();

      await expectRevert.unspecified(
        nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg')
      );
    });


    it('Checks that user1 cant mint token because ha dont have ecought MLU (and not approved)', async () => {
      const [ , user1 ] = await ethers.getSigners();

      await expectRevert.unspecified(
        nftContract.connect(user1).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg')
      );
    });


    it('Mint more NFTs and ensure correct current NFT cost, contract creator balance and community pool size', async () => {
      const [ contractCreator,,,,, communityPoolAccount ] = await ethers.getSigners();

      const testApprovalValue = BigInt(50000 * 1000000000000000000);
      await utilityContract.approve(nftContract.address, testApprovalValue);

      for (let i = 0; i < 10; i++) {
        await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      }

      const currentCost = await nftContract.getCurrentCost();
      let communityPoolContractBalance = await utilityContract.balanceOf(communityPoolAccount.address);
      let contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);

      expect(toReadableBalance(communityPoolContractBalance._hex)).to.equal(14.91);
      expect(toReadableBalance(contractCreatorUtilityBalance._hex)).to.equal(111096.09);
      expect(toReadableBalance(currentCost._hex)).to.equal(1.14);
    });


    it('Checks that community pool address can be changed by "contract creator" only', async () => {
      const [ contractCreator, user1,,,, communityPoolAccount, communityPool2Account ] = await ethers.getSigners();

      let currentPoolAddress = await nftContract.getCommunityPoolAddress();
      await expectRevert.unspecified(
        nftContract.connect(user1).setCommunityPoolAddress(communityPool2Account.address)
      );
      expect(currentPoolAddress).to.equal(communityPoolAccount.address);

      await nftContract.connect(contractCreator).setCommunityPoolAddress(communityPool2Account.address);
      currentPoolAddress = await nftContract.getCommunityPoolAddress();
      expect(currentPoolAddress).to.not.equal(communityPoolAccount.address);
      expect(currentPoolAddress).to.equal(communityPool2Account.address);
    });
  });

  // is it possible to spend tokens by someone else but not owner
  // ensure that noone can mint new utility, even contract creator
})

function toReadableBalance(hex) {
  const zeros = 1000000000000000000n;
  return Number(BigInt(hex) * 100n / zeros) / 100;
}
