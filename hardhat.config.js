require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
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

const RINKEBY_PRIVATE_KEY = "1abf5190c77d2fcaf25d0f990b6c63ac2acf32974ec2a0b820795a5b44ea9591";

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy',
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};
