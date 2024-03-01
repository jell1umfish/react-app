import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login'
import Connected from './Components/Connected';
import Finished from './Components/Finished';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);
  const [winner, setWinner] = useState('');





  useEffect(() => {
    setVotingStatus(true);
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if(window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
        if(window.ethereum){
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
    }
}, []);


  async function vote(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );

      const tx = await contractInstance.vote(number);
      await tx.wait();
      canvote();
  }

  async function canvote(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const votestatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(votestatus);
  }

  async function getCandidates(){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
        const formattedCandidates = candidatesList.map((candidate, index) =>{
          return{
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber()
          }
        });
        setCandidates(formattedCandidates);
    }

  async function getCurrentStatus(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const status = await contractInstance.getVotingStatus();
      console.log(status);
      setVotingStatus(status);
  }

  async function getRemainingTime(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const time = await contractInstance.getRemainingTime();
      setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts){
    if(accounts.length > 0 && account !== accounts[0] ){
      setAccount(accounts[0]);
      canvote();
    }
    else{
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask(){
    if(window.ethereum){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask connected: "+ address);
        setIsConnected(true);
        canvote();
      }
      catch(err){
        console.error(err)
      }
    } else{
      console.error("Metamask is not detected in the browser");
    }
  }

  async function handleNumberChange(e){
    setNumber(e.target.value);
  }

  async function finishVoting() {
    setVotingStatus(false);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
      await contractInstance.finishVoting(); 
      console.log("Voting finished successfully");
  
      await getCandidates();
  
      const winnerName = determineWinner(candidates);
      setWinner(winnerName);
    } catch (error) {
      console.error("Error finishing voting:", error);
    }
  }

  function determineWinner(candidates) {
    if (candidates.length === 0) {
      return "No candidates available";
    }
  
    let maxVotes = candidates[0].voteCount;
    let winnerName = candidates[0].name;
  
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].voteCount > maxVotes) {
        maxVotes = candidates[i].voteCount;
        winnerName = candidates[i].name;
      }
    }
  
    return winnerName;
  }
  

  return (
    <div className="App">
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={canVote}
            showFinishButton={true} 
            finishVoting={finishVoting} 
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished winner={winner} />
      )}
    </div>
  );
}

export default App;
