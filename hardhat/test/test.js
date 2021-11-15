const { expect } = require("chai");
const { ethers } = require("hardhat");

const utilityContractAddress = '0xae94df75a611CA8fa38eBB9fef4a3199fAb1C80c';
const communityPoolAddress =   '0x0482c13d18303258687eB83519099cAe75A6eEF4';
const nftAddress =             '0xCdbE7a801b43Fb44F9559c23c280Df071C0638CE';

describe('memos.live economy test', function () {
  it('Should deploy utility token contract and mint tokens to the contractCreator', async function () {
    const [
      contractCreator
    ] = await ethers.getSigners();

    let utilityContract = await ethers.getContractFactory('MemosLiveUtility');
    utilityContract = await utilityContract.deploy('Memos Live Utility', 'MLU_TEST');
    await utilityContract.deployed();

    const totalSupply = await utilityContract.totalSupply();
    const balanceOfContractCreator = await utilityContract.balanceOf(contractCreator.address);

    expect(balanceOfContractCreator).to.equal(totalSupply);
  });


  it('should not allow to mint NFT if not enough MLU tokens to pay', async () => {
    const [
      contractCreator
    ] = await ethers.getSigners();
  });


  it('should pay current cost in MLU token and mint an NFT', async () => {
    const [
      contractCreator,
      user1,
      user2,
      user3,
      user4,
      user5,
    ] = await ethers.getSigners();
  });
})
