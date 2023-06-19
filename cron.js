var cron = require('node-cron');
const Marketplace1 = require('/home/dbetaieb/NFTmarketplace/src/Marketplace1.json');
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(API_URL);
const abi = Marketplace1.abi;
const contractAddress = Marketplace1.address; // Replace with your actual contract address
const {exec}= require("child_process");
const path ='/etc/hostapd';
// Contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Variable to store the previous map of addresses
let previousAddresses = [];

async function retrieveContractData() {
  // Retrieve data from the contract
  const allListings = await contract.methods.getAllListings().call();

  const currentAdresses = allListings.map(listing => listing[7]);

  if (arraysAreEqual(currentAdresses, previousAddresses)) {
    // If there is no change, delay the cron job
    console.log('No change in addresses. Cron job is delayed.');
    return;
  }

  previousAddresses = currentAdresses; // Update the previous addresses

  const addressmacs = allListings.map(listing => listing[6]);

  fs.writeFile('/etc/hostapd/hostapd.whitelist', addressmacs.join('\n'), err => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('addresses have been written to addresses.txt');
    }
  });
  exec('sudo systemctl restart hostapd.service');


}

function arraysAreEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

// Schedule the cron job
cron.schedule('* * * * * *', () => {
  retrieveContractData();
});