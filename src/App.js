import logo from './logo.svg';
import './App.css';
import { useWallet } from './context/WalletContext'




function App() {

  const {
    walletAddress,
    connectToWallet,
    isShowConnectMumbaiBtn,
    switchToMumbai,
    chainId
  } = useWallet();


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
