import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import Mynfts from './components/Mynfts';
import ReactDOM from "react-dom/client";
import SharedLayout from './components/SharedLayout'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route path="/" element={<Marketplace />} />
          <Route path="/sellNFT" element={<SellNFT />} />
          <Route path="/nftPage/:tokenId" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Mynfts" element={<Mynfts />} />

          
        </Route>
      </Routes>
  );
}

export default App;
