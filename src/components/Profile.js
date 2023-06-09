import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import Marketplace1 from "../Marketplace1.json";
import RentableNft from "../Rentablenft1.json";
import './test.css'


import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState(0);
    const [balance, setBalance] = useState(0);


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
            if (addr==i.owner)  {
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                duration: meta.duration,
            }
             console.log(price);
             sumPrice += Number(price);
             console.log(sumPrice);


            return item;

                                }
                                   
            
        }))
        
        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(2));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return (
        <div className="body" style={{"min-height":"100vh"}}>
            <div className=" text-xl ml-1 space-y-2 text-white shadow-2xl rounded-lg border-2 p-2 "
                style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    width:"60%",
                    margin:  "auto", /* Horizontally center the element */
                    justifycontent: "center" ,/* Center the content horizontally */
                 //   opacity:0.7
                    

         }} >
            <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                <div className="mb-5">
                    <h2 className="font-bold">Wallet Address</h2>  
                    {address}
                </div>
                <div className="mb-5">
                    <h2 className="font-bold">Wallet Balance</h2>  
                    {balance}
                </div>
            </div>
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                    <div>
                        <h2 className="font-bold">No. of NFTs</h2>
                        {data.length}
                    </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETH
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold">Your NFTs</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {data.length == 0 ? "No NFT data to display ":""}
                </div>
            </div>
            </div>
        </div>
    )
};