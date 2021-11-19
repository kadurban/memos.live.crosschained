const { expect, assert } = require("chai");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");

let utilityContract;
let communityPoolContract;
let nftContract;

let costStep = "10000000000000000";

let utilityContractBalance;
let communityPoolContractBalance;
let contractCreatorUtilityBalance;
let user1UtilityBalance;

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
        costStep,
        communityPoolContract.address
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
        await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
    });


    it('Checks that balances of community pool and contract creator are changed after minting of 1 NFT', async () => {
      const [
        contractCreator
      ] = await ethers.getSigners();

      communityPoolContractBalance = await utilityContract.balanceOf(communityPoolContract.address);
      contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);

      expect(toReadableBalance(communityPoolContractBalance._hex)).to.equal(1);
      expect(toReadableBalance(contractCreatorUtilityBalance._hex)).to.equal(9999);
    });


    it('Mint 3 more NFT by contract creator and ensure correct current NFT cost, contract creator balance and community pool size', async () => {
      const [
        contractCreator
      ] = await ethers.getSigners();
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');

      const currentNftCost = await nftContract.getCurrentCost();
      communityPoolContractBalance = await utilityContract.balanceOf(communityPoolContract.address);
      contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);

      expect(toReadableBalance(currentNftCost._hex)).to.equal(1.04);
      expect(toReadableBalance(communityPoolContractBalance._hex)).to.equal(4.06);
      expect(toReadableBalance(contractCreatorUtilityBalance._hex)).to.equal(9995.94);
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
      const [
        contractCreator,
        user1
      ] = await ethers.getSigners();

      // await expectRevert.unspecified(
      //   nftContract.balanceOf(user1.address)
      // );

      await expectRevert.unspecified(
        nftContract.connect(user1).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg')
      );
    });


    it('Mint 1000 NFTs and ensure correct current NFT cost, contract creator balance and community pool size', async () => {
      const [
        contractCreator,
        user1
      ] = await ethers.getSigners();

      const testApprovalValue = BigInt(50000 * 1000000000000000000);
      await utilityContract.approve(nftContract.address, testApprovalValue);

      for (let i = 0; i < 1000; i++) {
        await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
      }

      const currentCost = await nftContract.getCurrentCost();

      communityPoolContractBalance = await utilityContract.balanceOf(communityPoolContract.address);
      contractCreatorUtilityBalance = await utilityContract.balanceOf(contractCreator.address);

      console.log(toReadableBalance(communityPoolContractBalance._hex))
      console.log(toReadableBalance(contractCreatorUtilityBalance._hex))
    });


    // it('Ensure that it is not possible to mint NFT if there is not enough MLU tokens', async () => {
    //   const [
    //     contractCreator,
    //     user1
    //   ] = await ethers.getSigners();
    //
    //   utilityContractBalance = BigInt(await utilityContract.balanceOf(utilityContract.address));
    //   communityPoolContractBalance = BigInt(await utilityContract.balanceOf(communityPoolContract.address));
    //   contractCreatorUtilityBalance = BigInt(await utilityContract.balanceOf(contractCreator.address));
    //   user1UtilityBalance = BigInt(await utilityContract.balanceOf(user1.address));
    //
    //   console.log('utilityContractBalance        ', utilityContractBalance)
    //   console.log('communityPoolContractBalance  ', communityPoolContractBalance)
    //   console.log('contractCreatorUtilityBalance ', contractCreatorUtilityBalance)
    //   console.log('user1UtilityBalance           ', user1UtilityBalance)
    //
    //   await utilityContract.approve(nftContract.address, BigInt(5 * 1000000000000000000));
    //   await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
    //   await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
    //   await nftContract.connect(contractCreator).createToken('ipfs://ipfs/QmV2ovxsaA7rCtL1nyrnckioGbQxVdBDs5ZmWVkQrFpJSg');
    //
    //
    //
    //   utilityContractBalance = BigInt(await utilityContract.balanceOf(utilityContract.address));
    //   communityPoolContractBalance = BigInt(await utilityContract.balanceOf(communityPoolContract.address));
    //   contractCreatorUtilityBalance = BigInt(await utilityContract.balanceOf(contractCreator.address));
    //   user1UtilityBalance = BigInt(await utilityContract.balanceOf(user1.address));
    //
    //   console.log('utilityContractBalance        ', utilityContractBalance)
    //   console.log('communityPoolContractBalance  ', communityPoolContractBalance)
    //   console.log('contractCreatorUtilityBalance ', contractCreatorUtilityBalance)
    //   console.log('user1UtilityBalance           ', user1UtilityBalance)
    //
    // });









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


    //   it('Checks that NFT is successfully burned by owner', async () => {});
    //   it('Check that setCommunityPool is only can be called by "contract creator" and not anyone else', async () => {});
  });
})

function toReadableBalance(hex) {
  const zeros = 1000000000000000000n;
  return Number(BigInt(hex) * 100n / zeros) / 100;
}
