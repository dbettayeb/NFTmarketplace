var cron = require('node-cron');
const Marketplace1 = require('C:/Users/d.betaieb/Desktop/cronjob/Marketplace1.json');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/CxsnQRk6vVA0rsw6ddwpDS7R-bvLpGc7');
const abi = Marketplace1.abi;
const contractAddress = Marketplace1.address // Replace with your actual contract address

// Contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

async function retrieveContractData() {
    // Retrieve data from the contract
    const allListings = await contract.methods.getAllListings().call();
    // Write data to a file
    const jsonData = JSON.stringify(allListings, null, 2);
 //   fs.writeFileSync('contractData.json', jsonData);
//    console.log(allListings[1][0]);

// console.log(allListings);

const addressmacs = allListings.map(listing => listing[6]);

//console.log(macaddresses);
fs.writeFile('addresses.txt', addressmacs.join('\n'), err => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Statuses have been written to addresses.txt');
    }
  });


  }
  
  // Execute the cron job
  
  



cron.schedule('* * * * * *', () => {
    retrieveContractData();  

});











