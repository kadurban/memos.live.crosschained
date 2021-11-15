const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const utilityContract = await hre.ethers.getContractFactory("MemosLiveUtility");
  const utilityContractDaployed = await utilityContract.deploy("Memos Live Utility", "MLU_TEST");
  const utilityContractAddress = utilityContractDaployed.address;

  const communityPoolContract = await hre.ethers.getContractFactory("MemosLiveCommunityPool");
  const communityPoolContractDaployed = await communityPoolContract.deploy(utilityContractAddress);
  const communityPoolAddress = communityPoolContractDaployed.address;

  const nftContract = await hre.ethers.getContractFactory("MemosLiveNFT");
  const nftContractDaployed = await nftContract.deploy(
    "memos.live - Community-driven memorable NFT collection", // utility name
    "MEMOSLIVE_TEST", // utility ticker
    utilityContractAddress,
    "1000000000000000000", // initial_cost => 1 * 1000000000000000000 ===> 10^18 ===> 1
    "1000000000000000" // cost_step => 5 * 1000000000000000 ===> 10^15 ===> 0,005
  );
  const nftAddress = nftContractDaployed.address;

  await utilityContractDaployed.deployed();
  await communityPoolContractDaployed.deployed();
  await nftContractDaployed.deployed();

  console.log("                                TESTNET");
  console.log(`const utilityContractAddress = '${utilityContractAddress}';`);
  console.log(`const communityPoolAddress =   '${communityPoolAddress}';`);
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
