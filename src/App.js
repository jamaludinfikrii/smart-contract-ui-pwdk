import logo from './logo.svg';
import './App.css';
import { useWallet } from './context/WalletContext'
import Abi from './abi/erc721Starter.json'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';



function App() {

  const {
    provider,
    walletAddress,
    connectToWallet,
    isShowConnectMumbaiBtn,
    switchToMumbai,
    chainId
  } = useWallet();

  const [privateSaleStart, setPrivateSaleStart] = useState();
  const [privateSaleEnd, setPrivateSaleEnd] = useState();
  const [isUserWhitlisted, setIsUserWhitlisted] = useState(false);
  const [isUserHasMinted, setIsUserHasMinted] = useState(false);

  const [contract, setContract] = useState();

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

  useEffect(() => {
    const getInitData = async () => {
      // uint256 public privateSaleStartTimestamp;
      // uint256 public privateSaleEndTimestamp;

      const _privateSaleStartTimestamp = await contract.privateSaleStartTimestamp()
      const _privateSaleEndTimestamp = await contract.privateSaleEndTimestamp()

      console.log(_privateSaleEndTimestamp.toNumber())
      console.log(_privateSaleStartTimestamp.toNumber())

    }

    if (contract) {
      getInitData()
    }
  }, [contract])



  return (
    <div className="App">
      <header className="App-header">
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

      <div>

      </div>
    </div>
  );
}

export default App;
