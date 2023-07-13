const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  const RentableNft = await hre.ethers.getContractFactory("RentableNft");

  await marketplace.deployed();
  


  const datamarketplace = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json'))
  }


  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./src/Marketplace1.json', JSON.stringify(datamarketplace))
  const rentablenft = await RentableNft.deploy(marketplace.address);
  await rentablenft.deployed();
    
  const datarentablenft = {
    address: rentablenft.address,
    abi: JSON.parse(rentablenft.interface.format('json'))
  }
  fs.writeFileSync('./src/Rentablenft1.json', JSON.stringify(datarentablenft))



}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
