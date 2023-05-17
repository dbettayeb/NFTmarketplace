require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
       url: "https://eth-sepolia.g.alchemy.com/v2/CxsnQRk6vVA0rsw6ddwpDS7R-bvLpGc7",
       accounts: [`0x${"ce17042ec0498b0f52bf4e42a7c20b6c54b7f755485ad406ede1f594331cfbc2"
       }`]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};