import logo from '../logo_3.png';
import fullLogo from '../logo_orange.svg';
import wifiicon from  '../symbole-wifi-icone-png-orange.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import './navBar.css'
function Navbar() {

  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');
  const [balance, setBalance] = useState(0);


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

  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      })
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
  }

  useEffect(() => {
    if (window.ethereum == undefined)
      return;
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.replace(location.pathname)
    })
  },[location.pathname]);

  return (
    <nav className="navBar">
      <div className="container-fluid">
        <nav className="w-screen">
          <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
            <li className='flex items-end ml-5 pb-4'>
              <Link to="/">
                <img src={fullLogo} alt="" width={70} height={70} className="inline-block -mt-2" />
                <div className='inline-block font-bold text-xl ml-2'>
                  Wi-Fi NFT Marketplace
                </div>
                <img src={wifiicon} alt="" width={40} height={40} className="inline-block -mt-2 ml-6" />

              </Link>
            </li>
            <li className='w-2/6'>
              <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
                {location.pathname === "/" ?
                  <li className='border-b-2 hover:pb-0 p-2'>
                    <Link to="/">Marketplace</Link>
                  </li>
                  :
                  <li className='hover:border-b-2 hover:pb-0 p-2'>
                    <Link to="/">Marketplace</Link>
                  </li>
                }
                {location.pathname === "/sellNFT" ?
                  <li className='border-b-2 hover:pb-0 p-2'>
                    <Link to="/sellNFT">List NFT</Link>
                  </li>
                  :
                  <li className='hover:border-b-2 hover:pb-0 p-2'>
                    <Link to="/sellNFT">List NFT</Link>
                  </li>
                }
                {location.pathname === "/profile" ?
                  <li className='border-b-2 hover:pb-0 p-2'>
                    <Link to="/profile">Profile</Link>
                  </li>
                  :
                  <li className='hover:border-b-2 hover:pb-0 p-2'>
                    <Link to="/profile">Profile</Link>
                  </li>
                }
                <li>
                  <button className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>
                    {connected ? "Connected" : "Connect Wallet"}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x" ? (
            <div className='inline-block font-bold text-m ml-2' >
              Connected to: {currAddress.substring(0, 15)}...
              <br />
              Balance: {balance.toString().substring(0,6)} ETH
            </div>
          ) : (
            "Not Connected. Please login to view NFTs"
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
