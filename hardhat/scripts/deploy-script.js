const hre = require("hardhat");

async function main() {
  const utilityContract = await hre.ethers.getContractFactory("MemosLiveUtility");
  const utilityContractDaployed = await utilityContract.deploy("memos.live Utility", "MLU");
  const utilityContractAddress = utilityContractDaployed.address;

  const nftContract = await hre.ethers.getContractFactory("MemosLiveNFT");
  const nftContractDaployed = await nftContract.deploy(
    'memos.live digital cards', // Collection name
    'MEMOSLIVE', // Collection ticker
    utilityContractAddress,
    '1000000000000000000', // initial_cost => 1 * 1000000000000000000 ===> 10^18 ===> 1
    '1000000000000000', // cost_step => 5 * 1000000000000000 ===> 10^15 ===> 0,005
    '0xCc080c4eC62a1AeF1052fA55B4Ea39182f1ee345' // community pool
  );
  const nftAddress = nftContractDaployed.address;

  await utilityContractDaployed.deployed();
  await nftContractDaployed.deployed();

  console.log(`const utilityContractAddress = '${utilityContractAddress}';`);
  console.log(`const nftAddress =             '${nftAddress}';`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
