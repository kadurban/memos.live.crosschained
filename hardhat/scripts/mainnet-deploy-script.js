const hre = require("hardhat");

async function main() {
  const utilityContract = await hre.ethers.getContractFactory("MemosLiveUtility");
  const utilityContractDaployed = await utilityContract.deploy("Memos Live Utility Token", "MLU");
  const utilityContractAddress = utilityContractDaployed.address;

  const nftContract = await hre.ethers.getContractFactory("MemosLiveNFT");
  const nftContractDaployed = await nftContract.deploy(
    'memos.live', // Collection name
    'MEMOSLIVE', // Collection ticker
    utilityContractAddress,
    '1000000000000000000', // initial_cost => 1 * 1000000000000000000 ===> 10^18 ===> 1
    '1000000000000000', // cost_step => 5 * 1000000000000000 ===> 10^15 ===> 0,005
    '0x61c86C86B3a81F722aFa91F969A441B38C9eA7fE' // community pool
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
