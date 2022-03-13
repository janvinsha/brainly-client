import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { sequence } from '0xsequence';

// NOTE: here we use a forked package of web3modal, named @0xsequence/web3modal
// Once the web3modal PR https://github.com/Web3Modal/web3modal/pull/402 is merged,
// then you can just import from 'web3modal' directly without any other changes.
import Web3Modal from '@0xsequence/web3modal';

import WalletConnect from '@walletconnect/web3-provider';
import { GlobalStyle, Nav, Footer } from './components';
import { Home, DashBoard } from './pages';
import AppContext from './context/AppContext';

import ThemeContext from './context/themeContext';
import contract from './utils/contract.json';

const CONTRACT_ADDRESS = '0xD61fdFdfD230ABc4a3619AAf38B6Bb8D4aa4296E';

let providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: 'fdd5eb8e3a004c9c9caa5a91a48b92b6',
      chainId: 80001,
    },
  },
};

if (!window?.ethereum?.isSequence) {
  providerOptions = {
    ...providerOptions,
    sequence: {
      package: sequence,
      options: {
        appName: 'Brainly',
        defaultNetwork: '',
        chainId: 80001,
      },
    },
  };
}
const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
  theme: `light`,
});

function App() {
  const [color, setColor] = useState(false);
  const [sound, setSound] = useState(JSON.parse(localStorage.getItem('sound')));
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme')));

  const [minting, setMinting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [changingName, setChangingName] = useState(false);
  const [users, setUsers] = useState([]);
  const [accountDetails, setAccountDetails] = useState();
  const [provider, setProvider] = useState();
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

  const checkIfWalletIsConnected = async () => {
    if (web3Modal.cachedProvider) {
      let wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);
      setProvider(tProvider);
      // You can list the connected accounts without launching Web3Modal
      const accounts = await tProvider?.listAccounts();
      console.log('CHECKING ACCOUNT ADDRESS', accounts[0]);
      //   console.log('Accounts', accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        const signer = tProvider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contract.abi,
          signer
        );

        setCurrentAccount(account);
        fetchAccountDetails(account);
        console.log('Going to pop wallet now to pay gas...');
        let chainId = await signer.getChainId();
        if (chainId == 80001) {
          let txn = await connectedContract.isMember();
          console.log(txn, 'IS MEMBER');

          if (txn === true) {
            setIsMember(txn);
          }

          setupEventListener();
        } else {
          alert('CONNECT TO POLYGON MATIC(TESTNET) TO CONTINUE');
        }
        // Setup listener! This is for the case where a user comes to our site
        // and ALREADY had their wallet connected + authorized.
      } else {
        console.log('No authorized account found');
      }

      // String, hex code of the chainId of the Rinkebey test network
    } else {
      setCurrentAccount();
      setIsMember();
    }
  };

  const connectWallet = async () => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    try {
      const wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);

      if (wallet.sequence) {
        tProvider.sequence = wallet.sequence;
      }
      setProvider(tProvider);
      const accounts = await tProvider.listAccounts();

      console.log('CONNECTED', accounts[0]);
      setCurrentAccount(accounts[0]);
      fetchAccountDetails(accounts[0]);
      setupEventListener();
      checkIfWalletIsConnected();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    const signer = tProvider?.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contract.abi,
      signer
    );
    connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
      console.log(from, tokenId.toNumber());
      alert(
        `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );
      setIsMember(true);
    });
    // Same stuff again
    console.log('Setup event listener!');
  };

  const askContractToMintNft = async () => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
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
    } catch (error) {
      setMinting(false);
      console.log(error);
    }
  };
  const publishScore = async level => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );
      setPublishing(true);
      console.log('Going to pop wallet now to pay gas..., for publishing');
      const tx = await connectedContract.publish(level);
      setPublishing(false);
      console.log('Published Successfully', tx);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWeb3Modal = async () => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    if (tProvider && tProvider.sequence) {
      const wallet = tProvider.sequence;
      wallet.disconnect();
    }
    web3Modal.clearCachedProvider();
    setCurrentAccount();
    setIsMember();
    localStorage.setItem('userLevel', JSON.stringify(1));
  };
  // useEffect(() => {
  // if (web3Modal.cachedProvider) {
  //   connectWallet();
  // }
  // }, []);

  const getAllUsers = async () => {
    if (web3Modal.cachedProvider) {
      const wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      try {
        const signer = tProvider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contract.abi,
          signer
        );

        const usersAddresses = await connectedContract.fetchUserAddresses();

        let _users = await Promise.all(
          usersAddresses.map(async address => {
            const userRecord = await connectedContract.getUser(address);
            const name = await connectedContract.getName(address);
            return {
              userAddress: address,
              level: Number(userRecord.level),
              name: name || 'User',
            };
          })
        );
        setUsers(_users);
        console.log('HERE ARE THE USERS', _users);
      } catch (error) {
        console.log('PROBLEM FETCHING USERS', error);
      }
    }
  };

  const changeName = async name => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );
      setChangingName(true);
      console.log('Going to pop wallet now to pay gas..., for chaning name');
      const tx = await connectedContract.setName(name);
      setChangingName(false);
      console.log('Changed name successfully Successfully', tx);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAccountDetails = async account => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );

      const name = await connectedContract.getName(account);
      const user_ = await connectedContract.getUser(account);
      setAccountDetails({
        name,
        userAddress: account,
        level: Number(user_.level),
      });
      console.log('ACCOUNT DETAILS HERE', {
        name,
        userAddress: account,
        level: Number(user_.level),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
    console.log('E dey here oo', web3Modal.cachedProvider);
    getAllUsers();
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
          disconnectWeb3Modal,
          publishScore,
          publishing,
          accountDetails,
          changeName,
          changingName,
          users,
        }}
      >
        <div className="App">
          <GlobalStyle theme={theme} />
          <Nav />
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<DashBoard />} />
            </Routes>
          </AnimatePresence>
          <Footer theme={theme} />
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
