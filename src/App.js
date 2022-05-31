import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers, utils } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const networkMap = {
  POLYGON_MAINNET: {
    chainId: utils.hexValue(137), // '0x89'
    chainName: "Matic(Polygon) Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
  },
  MUMBAI_TESTNET: {
    chainId: utils.hexValue(80001), // '0x13881'
    chainName: "Matic(Polygon) Mumbai Testnet",
    nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};


function App() {
  const [provider, setProvider] = useState();
  const [walletAddress, setWaletAddress] = useState();
  const [chainId, setChainId] = useState();

  useEffect(() => {
    const checkConnectedWallet = async () => {
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        setWaletAddress(address);
        const ethProvider = await detectEthereumProvider();
        const chainId =  Number(ethProvider.networkVersion);
        setChainId(chainId);
      } catch (e) {
        console.error(e.message);
      }
    }

    const listenToWalletAddressChange = async () => {
      const ethProvider = await detectEthereumProvider();
      ethProvider.on('accountsChanged', (accounts) => {
        setWaletAddress(accounts[0]);
      });
    }

    const listenToChainIdChange = async () => {
      const ethProvider = await detectEthereumProvider();
      ethProvider.on('chainChanged', (chainId) => {
        setChainId(Number(chainId));
      });
    }

    if (provider) {
      checkConnectedWallet();
      listenToWalletAddressChange();
      listenToChainIdChange();
    }
  }, [provider]);

  useEffect(() => {
    const initProvider = async () => {
      const ethProvider = await detectEthereumProvider();
      if (!ethProvider) {
        alert('Metamask is not installed');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethProvider);
      setProvider(provider);
    }

    initProvider();
  }, []);

  const connectToWallet = async () => {
    try {
      if (!provider) {
        throw new Error('Provider is not initialized');
      }
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWaletAddress(address);
    } catch (e) {
      alert(e.message);
    }
  }

  const switchToMumbai = async () => {
    const ethProvider = await detectEthereumProvider();
    try {
      await ethProvider.request({
        method: 'wallet_addEthereumChain',
        params: [networkMap['MUMBAI_TESTNET']]
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          !walletAddress &&
          <button onClick={connectToWallet}>
            Connect to Metamask
          </button>
        }
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          { walletAddress && <span>Your address: {walletAddress}</span> }
        </a>

        <button onClick={switchToMumbai}>
          Switch To Mumbai
        </button>

        { chainId && <span>ChainId: {chainId}</span> }
      </header>
    </div>
  );
}

export default App;
