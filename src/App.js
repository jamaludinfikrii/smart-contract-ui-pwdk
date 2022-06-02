import logo from './logo.svg';
import './App.css';
import { useWallet } from './context/WalletContext'
import Abi from './abi/erc721Starter.json'
import { ethers } from 'ethers'
import { useEffect } from 'react';



function App() {

  const {
    provider,
    walletAddress,
    connectToWallet,
    isShowConnectMumbaiBtn,
    switchToMumbai,
    chainId
  } = useWallet();

  useEffect(() => {

    const testSmartContract = async () => {
      const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
      const contract = new ethers.Contract(
        contractAddress,
        Abi.abi,
        provider
      )

      const nftPrice = await contract.PRICE()
      console.log(nftPrice.toString())
      console.log(contract)
    }

    if(provider) {
      testSmartContract()
    }

  }, [provider])


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
        {
          isShowConnectMumbaiBtn && (
            <button onClick={switchToMumbai}>
              Switch To Mumbai
            </button>
          )
        }
        { chainId && <span>ChainId: {chainId}</span> }
      </header>
    </div>
  );
}

export default App;
