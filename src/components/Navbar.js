import logo from '../logo_3.png';
import fullLogo from '../logo_orange.svg';
import wifiicon from '../symbole-wifi-icone-png-orange.png';
import Web3 from 'web3';

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

import './navBar.css';

function Navbar() {

  // const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  //const [currAddress, updateAddress] = useState('0x');
  //const [balance, setBalance] = useState(0);

  // async function getAddress() {
  //   const ethers = require("ethers");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const addr = await signer.getAddress();
  //   updateAddress(addr);
  //   // Fetch the balance of the current address
  //   const balancee = await provider.getBalance(addr);
  //   const balance = ethers.utils.formatEther(balancee);
  //   setBalance(balance);
  // }

  // function updateButton() {
  //   const ethereumButton = document.querySelector('.enableEthereumButton');
  //   ethereumButton.textContent = "Connected";
  //   ethereumButton.classList.remove("hover:bg-blue-70");
  //   ethereumButton.classList.remove("bg-blue-500");
  //   ethereumButton.classList.add("hover:bg-green-70");
  //   ethereumButton.classList.add("bg-green-500");
  // }

  // async function connectToWallet() {
  //   try {
  //     // Request access to the MetaMask wallet
  //     await window.ethereum.request({ method: 'eth_requestAccounts' });

  //     // Get the selected account
  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //     const selectedAccount = accounts[0];

  //     // Update the current account and set isConnected to true
  //     updateAddress(selectedAccount);
  //     toggleConnect(true);

  //     // Listen for account changes
  //     window.ethereum.on('accountsChanged', handleAccountChange);

  //     // Update button state and refresh the page
  //     updateButton();
  //     getAddress();
  //     window.location.replace(location.pathname);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const handleAccountChange = (accounts) => {
  //   // Handle account change
  //   if (accounts.length === 0) {
  //     // User disconnected their wallet
  //     toggleConnect(false);
  //     updateAddress('');
  //     window.ethereum.removeAllListeners(); // Remove all event listeners
  //   } else if (accounts[0] !== currAddress) {
  //     // User switched to a different account
  //     updateAddress(accounts[0]);
  //     getAddress();
  //   }
  // };

  // useEffect(() => {
  //   if (window.ethereum === undefined)
  //     return;

  //   let val = window.ethereum.isConnected();
  //   if (val) {
  //     getAddress();
  //     toggleConnect(val);
  //     updateButton();
  //   }

  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     window.location.replace(location.pathname);
  //   });
  // }, [location.pathname])
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [connected, setconnected] = useState(false);
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const balanceInWei = await web3.eth.getBalance(accounts[0]);
        const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
        setAccount(accounts[0]);
        setBalance(balanceInEther);
        setconnected(true);
        // Add event listener for accountsChanged
        window.ethereum.on('accountsChanged', handleAccountsChanged);


      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  const disconnectMetaMask = () => {
    // Remove event listener for accountsChanged
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    setAccount('');
    setBalance(0);
    setconnected(false);


  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      const web3 = new Web3(window.ethereum);
      const balanceInWei = await web3.eth.getBalance(accounts[0]);
      const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
      setAccount(accounts[0]);
      setBalance(balanceInEther);
      setconnected(true);
      window.location.reload();



    } else {
      disconnectMetaMask();
      window.location.reload();


    }
  };

  useEffect(() => {
    // Fetch initial account and balance if already connected to MetaMask
    if (window.ethereum && window.ethereum.selectedAddress) {
      handleAccountsChanged([window.ethereum.selectedAddress]);
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      // Cleanup the listener
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);

    };
  }, []);

  
  



  async function getAddress() {
    try {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAccount(addr);
        // Fetch the balance of the current address
        const balancee = await provider.getBalance(addr);
        const balance = ethers.utils.formatEther(balancee);
        setBalance(balance);
        
    } catch {
        console.log("SSS")
    }   
}



    getAddress();
    if (!account) {
    return (
      <nav className="navBar">
  <div className="container-fluid">
    <nav className="w-screen">
      <ul className="flex flex-wrap items-center justify-between py-3 bg-transparent text-white pr-5">
        <li className="w-full md:w-auto flex items-center justify-center md:justify-start mb-2 md:mb-0">
          <Link to="/">
            <img src={fullLogo} alt="" width={50} height={50} className="inline-block -mt-2" />
            <div className="inline-block font-bold text-xl ml-2">
              Wi-Fi NFT Marketplace
            </div>
            <img src={wifiicon} alt="" width={40} height={40} className="inline-block -mt-2 ml-6" />
          </Link>
        </li>
        <li>
          <button
            className="enableEthereumButton bg-orange-500 text-white font-bold py-2 px-4 rounded text-sm"
            onClick={connectMetaMask}
          >
            Connect
          </button>
        </li>
      </ul>
    </nav>
    <div className="text-white text-bold text-right mr-10 text-sm">
      Not Connected. Please login to view NFTs
    </div>
  </div>
</nav>

    );
  }
  return (
    <nav className="navBar">
      <div className="container-fluid">
        <nav className="w-screen">
          <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
            <li className='flex items-end ml-5 pb-4'>
              <Link to="/">
                <img src={fullLogo} alt="" width={50} height={50} className="inline-block -mt-2" />
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
                  <button className="enableEthereumButton bg-orange-500  text-white font-bold py-2 px-4 rounded text-sm" onClick={account ? disconnectMetaMask : connectMetaMask}>
                    {account ? 'Disconnect' : 'Connect'}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {account ? (
            <div className='inline-block font-bold text-m ml-2' >
              Connected to: {account.substring(0, 15)}...
              <br />
              Balance: {balance.toString().substring(0, 6)} ETH
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
