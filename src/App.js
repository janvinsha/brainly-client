import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { GlobalStyle, Nav, Footer } from './components';
import { Home } from './pages';
import AppContext from './context/AppContext';

import ThemeContext from './context/themeContext';
import contract from './utils/contract.json';

const CONTRACT_ADDRESS = '0x7c634dFbAe0425ddEFBeF8370b9cD63Ff3e06c89';

function App() {
  const [color, setColor] = useState(false);
  const [sound, setSound] = useState(JSON.parse(localStorage.getItem('sound')));
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme')));
  const [minting, setMinting] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [users, setUsers] = useState([]);
  const changeTheme = () => {
    setTheme(!theme);
    localStorage.setItem('theme', JSON.stringify(!theme));
  };
  const changeSound = () => {
    setSound(!sound);
    localStorage.setItem('sound', JSON.stringify(!sound));
  };

  const location = useLocation();
  const [currentAccount, setCurrentAccount] = useState('');
  const [nftAmount, setNftAmount] = useState('0');
  const [wallet, setWallet] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );

      console.log('Going to pop wallet now to pay gas...');
      let txn = await connectedContract.isMember();
      console.log(txn, 'IS MEMBER');
      setCurrentAccount(account);
      setWallet({ address: account });
      setIsMember(txn);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log('No authorized account found');
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain ' + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const polygonChainId = '0x13881';
    if (chainId !== polygonChainId) {
      alert('You are not connected to the Mumbai Test Network!');
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft

    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contract.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
        setIsMember(true);
        console.log('Setup event listener!');
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contract.abi,
          signer
        );

        console.log('Going to pop wallet now to pay gas...');
        let nftTxn = await connectedContract.mintToken();

        console.log('Mining...please wait.');
        setMinting(true);
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`
        );
        setMinting(false); //set NFT amount
      } else {
        setMinting(false);
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMinting(false);
      console.log(error);
    }
  };

  const logout = () => {};
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, changeTheme }}>
      <AppContext.Provider
        value={{
          currentAccount,
          setCurrentAccount,
          sound,
          setSound,
          changeSound,
          minting,
          setMinting,
          askContractToMintNft,
          connectWallet,
          isMember,
        }}
      >
        <div className="App">
          <GlobalStyle theme={theme} />
          <Nav />
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </AnimatePresence>
          <Footer theme={theme} />
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
