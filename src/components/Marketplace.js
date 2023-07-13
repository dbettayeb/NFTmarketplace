import NFTTile from "./NFTTile";
import Marketplace1 from '../Marketplace1.json';
import RentableNft from '../Rentablenft1.json';
import wifii from "C:/Users/d.betaieb/Desktop/Rental WIFI NFT Marketplace/src/wifii.png";
import fullLogo from '../logo_orange.svg';

import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import './test.css'

export default function Marketplace() {
    const sampleData = [
    ];
    const [data, updateData] = useState(sampleData);
    const [renteddata, updaterentedData] = useState(sampleData);

    const [dataFetched, updateFetched] = useState(false);
  //  const [inputAddress, setinputAddress] = useState('');
    const [currAddress, updateAddress] = useState('0x0');
    const [balance, setBalance] = useState(0);



  const options = [
    { value: '0xBf96daA9A788774a3cAFeafA152f92c29139A238', label: ' 0xBf96daA9A788774a3cAFeafA152f92c29139A238' },
    { value: '0x4B57Fb799c175Fe6dDFF75b2dCFd034d781B5cE9', label: '0x4B57Fb799c175Fe6dDFF75b2dCFd034d781B5cE9' },
    { value: '0x7Fb8478e6F48D473B7C851Ae6C177338bEB63BF2', label: '0x7Fb8478e6F48D473B7C851Ae6C177338bEB63BF2' }

    // Add more addresses as needed...
  ];

  const [selectedAddress, setSelectedAddress] = useState(options[0].value);
  const [string, setstring] = useState("Marketplace");

  function handleInputChange(value) {
    setSelectedAddress(value);
  }



  async function getAddress() {
    try {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        updateAddress(addr);
        // Fetch the balance of the current address
        const balancee = await provider.getBalance(addr);
        const balance = ethers.utils.formatEther(balancee);
        setBalance(balance);
        
    } catch {
        console.log("SSS")
    }   
}

  
  

    // ... existing code



    
    async function getAllNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer)

        //create an NFT Token
        let transaction = await contract.getAllListings()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                duration: meta.duration,
                state: i.state,
                addressmac: i.mac
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);


    }
       // ... existing code
       async function getnotrentedNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer)
  
        //create an NFT Token
        let transaction = await contract.getAllnotRented()
  
        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
  
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                duration: meta.duration,
                state: i.state,
                addressmac: i.mac
            }
            return item;
        }))
  
        updateFetched(true);
        updateData(items);
  }
     // ... existing code
     async function getrentedNFTs() {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Pull the deployed contract instance
      let contract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
      let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer)

      //create an NFT Token
      let transaction = await contract.getAllRented()

      //Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(transaction.map(async i => {
          var tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
          console.log("getting this tokenUri", tokenURI);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          let item = {
              price,
              tokenId: i.tokenId.toNumber(),
              owner: i.owner,
              image: meta.image,
              name: meta.name,
              description: meta.description,
              duration: meta.duration,
              state: i.state,
              addressmac: i.mac
          }
          return item;
      }))

      updateFetched(true);
      updateData(items);
}
    async function getAllNFTsByAddress(account) {
        try {
          const ethers = require("ethers");
          // After adding your Hardhat network to your MetaMask, this code will get providers and signers
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          // Pull the deployed contract instance
          let contract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer);
          let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer);
      
          // Create an NFT Token
          let transaction = await contract.getAllListingsByAddress(account);
      
          // Fetch all the details of every NFT from the contract and display
          const items = await Promise.all(
            transaction.map(async (i) => {
              var tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
              console.log("getting this tokenUri", tokenURI);
              tokenURI = GetIpfsUrlFromPinata(tokenURI);
              let meta = await axios.get(tokenURI);
              meta = meta.data;
      
              let price = ethers.utils.formatUnits(i.price.toString(), "ether");
              let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                duration: meta.duration,
                state: i.state,
                addressmac: i.mac,
              };
              return item;
            })
          );
      
          updateFetched(true);
          updateData(items);
        } catch (error) {
          alert("Please enter a valid address.");
        }
      }
      

    /*
    async function getrentedNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer)
    
        //create an NFT Token
        let transaction = await contract.getAllRentings()
    
        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
    
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                duration: meta.duration,
                addressmac:meta.mac
            }
            return item;
        }))
    
        updateFetched(true);
        updaterentedData(items);
    }   */

    if (!dataFetched)
        getAllNFTs();
        getAddress();
    // getrentedNFTs();
    if (currAddress === '0x0') {
      return (
        <div>
          <div className="flex items-center justify-center ">
            <h2 className="flex text-center flex-col mt-11 md:text-xl text-white connect">PLEASE CONNECT TO YOUR METAMASK WALLET </h2>

          </div>
          <div id="myDiv">
            <img src={wifii} alt="" width={400} height={400} className="rocket animated bounce" />
          </div>
        </div>
      );
    }
    

    return (
      <div className="index">
      <div className="flex items-end ml-5 pb-4">
        <button
          className="enableEthereumButton bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={() => {
            setstring("Marketplace");
            getAllNFTs();
          }}
        >
          Marketplace NFTs
        </button>
        <div className="ml-4">
          <button
            className="enableEthereumButton bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm ml-2"
            onClick={() => {
              setstring("My");
              getAllNFTsByAddress(currAddress);
            }}
          >
            My NFTs
          </button>
        </div>
        <div className="ml-4">
          <button
            className="enableEthereumButton bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm ml-2"
            onClick={() => {
              setstring("Available");
              getnotrentedNFTs(currAddress);
            }}
          >
            Available NFTs
          </button>
        </div>
        <div className="ml-4">
          <button
            className="enableEthereumButton bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm ml-2"
            onClick={() => {
              setstring(selectedAddress);
              getAllNFTsByAddress(selectedAddress);
            }}
          >
            Display NFTs of this address
          </button>
          <select
            className="enableEthereumButton text-white font-bold py-2 px-4 rounded text-sm inline-block"
            onChange={(e) => handleInputChange(e.target.value)}
            value={selectedAddress}
            style={{ color: 'black', width: '200px', height: '36px' }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">{string} NFTs</div>
    
        <div className="flex mt-5 justify-center md:justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
    
    );

}