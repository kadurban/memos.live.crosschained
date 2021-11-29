require("@nomiclabs/hardhat-waffle");
let { key } = require('./secret-mainnets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
global.task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "ganache",
  networks: {
    polygon: {
      url: "https://speedy-nodes-nyc.moralis.io/1fc3bfd25dc2f80f13d3363e/polygon/mainnet",
      accounts: [ key ],
      gasPrice: 8000000000
    }
  }
};
