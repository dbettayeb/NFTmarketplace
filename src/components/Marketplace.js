import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import Marketplace1 from '../Marketplace1.json';
import RentableNft from '../Rentablenft1.json';
import { Link } from 'react-router-dom';
import Mynfts from './Mynfts';

import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import './test.css'

export default function Marketplace() {
    const sampleData = [
        {
            "name": "NFT#1",
            "description": "Alchemy's First NFT",
            "website": "http://axieinfinity.io",
            "image": "",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#2",
            "description": "Alchemy's Second NFT",
            "website": "http://axieinfinity.io",
            "image": "",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#3",
            "description": "Alchemy's Third NFT",
            "website": "http://axieinfinity.io",
            "image": "",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
    ];
    const [data, updateData] = useState(sampleData);
    const [renteddata, updaterentedData] = useState(sampleData);

    const [dataFetched, updateFetched] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');

    // ... existing code

    function handleAddressChange(event) {
        const address = event.target.value;
        setSelectedAddress(address);
        getAllNFTs(address);
    }


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
    // getrentedNFTs();

    return (
        <div className="index">
            <div className="flex items-end ml-5 pb-4" >

                <button className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm " >
                    <Link to="/Mynfts">Show my NFTs</Link>
                </button>
            </div>

            <div className="flex flex-col place-items-center mt-20">


                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>

                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>



            </div>


        </div>
    );

}