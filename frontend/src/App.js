import { BrowserProvider, Contract, formatEther, formatUnits } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';

// NOTE: Make sure to change this to your deployed contract address
const simpleStorageAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';
const simpleStorageAbi = SimpleStorage.abi;

const App = () => {
  const [provider, setProvider] = useState();
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState('0');
  const [blockNumber, setBlockNumber] = useState('0');
  const [gasPrice, setGasPrice] = useState('0');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [connected, setConnected] = useState(false);

  // Runs once to set up provider and blockchain data
  useEffect(() => {
    if (window.ethereum) {
      console.log('Ethereum is available');

      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);

      const setBlockchainData = async () => {
        const blockNum = await provider.getBlockNumber();
        setBlockNumber(blockNum);

        let gas = await provider.getGasPrice();
        gas = Math.trunc(Number(formatUnits(gas, 'gwei')));
        setGasPrice(gas);
      };

      setBlockchainData();
    }
  }, []);

  // handles setting account and balance
  const accountHandler = async (account) => {
    setAccount(account);
    const balance = await provider.getBalance(account);
    setBalance(formatEther(balance));
  };

  // handles connecting account
  const connectHandler = async () => {
    await provider.send('eth_requestAccounts', []);
    const accountList = await provider.listAccounts();
    console.log(accountList);
    accountHandler(accountList[0]);
    setConnected(true);
  };

  // handles submit button to set value
  const handleSubmit = async (e) => {
    e.preventDefault();

    const signer = await provider.getSigner();
    const contract = new Contract(simpleStorageAddress, simpleStorageAbi, signer);

    const tx = await contract.set(inputValue);
    await tx.wait(); // wait for transaction to be mined

    console.log('Transaction confirmed:', tx);
    console.log('Input Value:', inputValue);
  };

  // handles retrieving data
  const handleRetrieveData = async () => {
    const contract = new Contract(simpleStorageAddress, simpleStorageAbi, provider);
    const storedValue = await contract.get();
    setValue(formatUnits(storedValue, 0));
  };

  return (
    <div className='layout'>
      <header className='navbar'>
        <div className='container'>
          <div className='logo'>Simple Storage</div>
          {connected ? (
            <div>
              <label>{Number.parseFloat(balance).toPrecision(4)} ETH</label>
              <button className='account-button' onClick={connectHandler}>
                {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </button>
            </div>
          ) : (
            <button className='connect-button' onClick={connectHandler}>
              Connect
            </button>
          )}
        </div>
      </header>

      <section className='cards'>
        <div className='card'>
          <h2>Set Value</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              name='value'
              placeholder='0'
            />
            <button>Submit</button>
          </form>
        </div>
        <div className='card'>
          <h2>Get Value</h2>
          <button onClick={handleRetrieveData}>Retrieve</button>
          <label>{value}</label>
        </div>
      </section>

      <footer>
        <div className='container'>
          {gasPrice} gwei &bull; Block: {blockNumber}
        </div>
      </footer>
    </div>
  );
};

export default App;