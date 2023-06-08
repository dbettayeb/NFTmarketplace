import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from 'react-router-dom';
import Marketplace1 from "../Marketplace1.json";
import Rentablenft1 from "../Rentablenft1.json";

import './test.css'

import axios from "axios";
import { useEffect,useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage(props) {

    const [mac, setMac] = useState("")
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [remainingTime, setRemainingTime] = useState(0);
    const [countdownInterval, setCountdownInterval] = useState(null);
    



    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let marketplacecontract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablecontract = new ethers.Contract(Rentablenft1.address, Rentablenft1.abi, signer)




        //create an NFT Token
        var tokenURI = await rentablecontract.tokenURI(tokenId);
        const listedToken = await marketplacecontract.getListedTokenForId(Rentablenft1.address,tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);

        let item = {
            price: meta.price,
            tokenId: tokenId,
            owner: listedToken.owner,
            user: listedToken.user,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            duration : meta.duration,
            expires: listedToken.expires, // Add this line to set the expires value
            macaddres: listedToken.mac,

        }
        console.log(item);
        updateData(item);
        updateDataFetched(true);
        console.log("address", addr)
        updateCurrAddress(addr);
    }

    const handleInputChange = (value) => {
        
        setMac(value)

    };


    async function unlistnft(token){
      const ethers = require("ethers");

        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let marketplacecontract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer)
        let rentablecontract = new ethers.Contract(Rentablenft1.address, Rentablenft1.abi, signer)
        let transaction = await marketplacecontract.unlistNFT(Rentablenft1.address,tokenId);
        await transaction.wait();

      alert('Nft unlisted successfully');
      window.location.replace("/")
}


      
    async function rentnft(tokenId) {
        //const [string, setString] = useState('');

        try {

            
            const ethers = require("ethers");
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployedS contract instance
            let marketplacecontract = new ethers.Contract(Marketplace1.address, Marketplace1.abi, signer);
            const rentPrice = ethers.utils.parseUnits(data.price, 'ether')
            const durationint= parseInt(data.duration,10);
            const timestamp= Math.floor(Date.now() / 1000);
            const expires=timestamp+durationint*60;


            updateMessage("Renting the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await marketplacecontract.rentNFT(Rentablenft1.address,tokenId,rentPrice,expires,mac ,{value:rentPrice});
            await transaction.wait();
            // const response = await axios.post('http://localhost:3001/write', {
            //     string: mac,
            //     filePath: "C:/Users/d.betaieb/Desktop/addressmac.txt",
            //     append: true 
            // });

    
            alert('You successfully rent the NFT!');
            updateMessage("");
            window.location.reload()

        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }

    function timestampToDate(timestamp) {
      // Create a new Date object with the timestamp in milliseconds
      const date = new Date(timestamp * 1000);
    
      // Get the individual date components
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
    
      // Create the formatted date string
      const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
      return dateString;
    }


      

      


    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);
    if (typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

        return (
          <div className="body">
            <div style={{ "min-height": "100vh" }}>
              <div className="flex justify-center items-center mt-100">
                <img src={data.image} alt=""  className="w-2/7  border rounded-lg shadow-2xl "width="400" 
     height="500" />
                <div className="text-xl ml-1 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                  <div>
                    Name: {data.name}
                  </div>
                  <div>
                    Description: {data.description}
                  </div>
                  <div>
                    Price: <span className="">{data.price + " ETH"}</span>
                  </div>
                  <div>
                    Owner: <span className="text-sm">{data.owner}</span>
                  </div>
                  <div>
                    User: <span className="text-sm">{data.user}</span>
                  </div>
                  <div>
                    Duration: {data.duration + " MIN"}
                  </div>


                  
                  {data.user !== "0x0000000000000000000000000000000000000000" ? (
                    <div>
                    <div className="text-red-900">NFT already rented</div>
                    <div>
                    Expiration: {timestampToDate(data.expires) }
                  </div>
                  <div>
                    Mac: {data.macaddres }
                  </div>
                  </div>
                    
                  ) : (
                    <div>
                      {currAddress !== data.owner ? (
                        <div>
                          <button
                            className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm"
                            onClick={() => rentnft(tokenId)}
                          >
                            Rent this NFT
                          </button>

                          
                          <input className="enableEthereumButton   text-white font-bold py-2 px-4 rounded text-sm inline-block -mt-1 ml-2"

                            type="text"
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="your address Mac"
                            pattern="	^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$"
                            required
                            style={{ color: "black", width: "200px", height: "36px" }}
                          />
                        </div>
                      ) : (
                        <div>
                        <div className="text-emerald-700">You are the owner of this NFT</div>
                        <button
                        className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm"
                        onClick={() => unlistnft(tokenId)}
                      >
                        Unlist this nft
                      </button>
                      </div>
                      )}
                      <div className="text-green text-center mt-3">{message}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          );
          
}