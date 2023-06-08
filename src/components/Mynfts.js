import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import Marketplace1 from '../Marketplace1.json';
import RentableNft from '../Rentablenft1.json';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';


import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import './test.css'

export default function Mynfts() {
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
    const [renteddata, updaterentedData] = useState(sampleData);

    const [balance, setBalance] = useState(0);

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");


    async function getAddress() {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        updateAddress(addr);
        // Fetch the balance of the current address
        const balancee = await provider.getBalance(addr)
        const balance = ethers.utils.formatEther(balancee)
        setBalance(balance);
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



    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        const balancee = await provider.getBalance(addr)
        const balance = ethers.utils.formatEther(balancee)
        setBalance(balance);

        //Pull the deployed contract instance
        let marketplcacontract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablenftcontract = new ethers.Contract(RentableNft.address, RentableNft.abi, signer)


        //create an NFT Token
        let transaction = await marketplcacontract.getMyNFTs(RentableNft.address)

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */

        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await rentablenftcontract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            if (addr == i.owner) {
                let item = {
                    price: i.price,
                    tokenId: i.tokenId.toNumber(),
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                    duration: meta.duration,
                }
                return item;

            }

            sumPrice += Number(price);

        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(9));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);



    return (
        <div className="index">
            <div className="flex items-end ml-5 pb-4">

                <button className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm">
                    <Link to="/">Show All Nfts of the marketplace</Link>
                </button>
            </div>
            <div className="flex flex-col place-items-center mt-20">


            <div className="md:text-xl font-bold text-white">
                    My NFTs
                </div>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>




            </div>


        </div>
    );

}