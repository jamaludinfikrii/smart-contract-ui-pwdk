import React, { useEffect, useState } from "react";
import { ethers } from 'ethers'
import Abi from '../abi/erc721Starter.json'
import { useWallet } from "./WalletContext";


const ContractContext = React.createContext({});

export const ContractProvider = ({ children }) => {
  const { provider } = useWallet()
  const [ contract, setContract ] = useState();

  useEffect(() => {
    const initContract = async () => {
      const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
      const contract = new ethers.Contract(
        contractAddress,
        Abi.abi,
        provider
      )
      setContract(contract)
    }

    if (provider) {
      initContract()
    }

  }, [provider])


  const contextValue = {
    contract,
  }

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  )
};


export const useContract = () => {
  const context = React.useContext(ContractContext);
  if (!context) {
    throw new Error("This hook must be used inside a ContractContextProvider");
  }
  return context;
};

