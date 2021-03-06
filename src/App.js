import './App.css';
import { useWallet } from './context/WalletContext'
import { useEffect, useState } from 'react';
import { useContract } from './context/ContractContext';



function App() {

  const {
    walletAddress,
    connectToWallet,
    isShowConnectMumbaiBtn,
    switchToMumbai,
    chainId
  } = useWallet();

  const {
    contract,
  } = useContract()

  const [privateSaleStart, setPrivateSaleStart] = useState();
  const [privateSaleEnd, setPrivateSaleEnd] = useState();
  const [isUserWhitlisted, setIsUserWhitlisted] = useState(false);
  const [isUserHasMinted, setIsUserHasMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const getInitData = async () => {
      // uint256 public privateSaleStartTimestamp;
      // uint256 public privateSaleEndTimestamp;

      const _privateSaleStartTimestamp = await contract.privateSaleStartTimestamp()
      const _privateSaleEndTimestamp = await contract.privateSaleEndTimestamp()
      const _addressToMintQty = await contract.addressToMintQty(walletAddress);
      const _addressToDoneMinting = await contract.addressToDoneMinting(walletAddress);

      console.log(_privateSaleEndTimestamp.toNumber())
      console.log(_privateSaleStartTimestamp.toNumber())
      console.log(_addressToMintQty.toNumber())
      console.log(_addressToDoneMinting)

      setPrivateSaleEnd(_privateSaleEndTimestamp.toNumber())
      setPrivateSaleStart(_privateSaleStartTimestamp.toNumber())
      setIsUserWhitlisted(_addressToMintQty.toNumber() > 0 && !_addressToDoneMinting)
      setIsUserHasMinted(_addressToDoneMinting)
      setIsLoading(false)

    }

    if (contract && walletAddress) {
      getInitData()
    }
  }, [contract, walletAddress])

  const getProperMessage = () => {
    const now = new Date().getTime() / 1000;
    const isNowPresale = now > privateSaleStart && now < privateSaleEnd;

    console.log('now < priv',now < privateSaleStart)

    if (now < privateSaleStart) {
      return `Private Sale is not started yet, come back here at ${new Date(privateSaleStart * 1000).toLocaleString()}`
    }

    if (isNowPresale && !isUserWhitlisted) {
      return `You are not whitelisted yet, come back here at ${new Date(privateSaleEnd * 1000).toLocaleString()}`
    }

    if (isNowPresale && isUserWhitlisted && !isUserHasMinted) {
      return `You are whitelisted, now you can mint your tokens`
    }

    if (isNowPresale && isUserWhitlisted && isUserHasMinted) {
      return `You have already minted your tokens`
    }

  }



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
        {
          isLoading ? 'Loading...' : (
            <div style={{backgroundColor:'red', padding:'10px'}}>
              {
                getProperMessage()
              }
            </div>
          )
        }
      </header>

    </div>
  );
}

export default App;
