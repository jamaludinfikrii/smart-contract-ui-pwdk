import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, utils } from 'ethers';

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

const WalletContext = React.createContext({});

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [walletAddress, setWaletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [isShowConnectMumbaiBtn, setIsShowConnectMumbaiBtn] = useState(true);

  useEffect(() => {
    const checkConnectedWallet = async () => {
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        setWaletAddress(address);
        const ethProvider = await detectEthereumProvider();
        const chainIdNetwork =  Number(ethProvider.networkVersion);
        setIsShowConnectMumbaiBtn(chainIdNetwork !== 80001);
        setChainId(chainIdNetwork);
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
        setIsShowConnectMumbaiBtn(Number(chainId) !== 80001);
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
    const initPublicProvider = async () => {
      const ethProvider = await detectEthereumProvider();
      if (!ethProvider) {
        alert('Metamask is not installed');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethProvider);
      setProvider(provider);
    }

    const initRpcProvider = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/VIAcv-Nauve9DuqjlEw079cq6BOCGN9A');
      setProvider(provider);
    }

    initPublicProvider();
    // initRpcProvider();
  }, []);

  const connectToWallet = async () => {
    try {
      if (!provider) {
        throw new Error('Provider is not initialized');
      }
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const ethProvider = await detectEthereumProvider();
      const chainIdNetwork =  Number(ethProvider.networkVersion);
      setIsShowConnectMumbaiBtn(chainIdNetwork !== 80001);
      setChainId(chainIdNetwork);
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

  const contextValue = {
    provider,
    walletAddress,
    chainId,
    isShowConnectMumbaiBtn,
    connectToWallet,
    switchToMumbai
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
};

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("This hook must be used inside a WalletContextProvider");
  }
  return context;
};