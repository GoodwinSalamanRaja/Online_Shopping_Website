import { useState, useEffect } from "react";
import Web3 from "web3";
import ContractAbi from "./ContractAbi.json";

function WebMetamask() {
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState("");
  const [symbol, setSymbol] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const contractAddress = "0x07DDB502F68964EDc7531B556F50f6310aFfAaEa";
  useEffect(() => {
    const getAccount = async () => {
      try {
        if (window.ethereum) {
          console.log(window.ethereum);
          const web3 = new Web3(window.ethereum);
          console.log(web3);
          const accounts = await web3.eth.getAccounts();
          console.log("accounts",accounts);
          const balance = await web3.eth.getBalance(accounts[0]);
          console.log("balance", balance);
          const contract = new web3.eth.Contract(ContractAbi, contractAddress);
          console.log("contract", contract);
          const symbol = await contract.methods._symbol().call();
          console.log(symbol);
          const newBalance = await contract.methods
            .balanceOf(accounts[0])
            .call();
          console.log(newBalance);
          setAccounts(accounts[0]);
          setBalance(balance);
          setSymbol(symbol);
          setNewBalance(newBalance);
          setWeb3Instance(web3);
          setContractInstance(contract);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAccount();
  }, []);
  return {
    accounts,
    balance,
    symbol,
    newBalance,
    web3Instance,
    contractInstance,
  };
}

export default WebMetamask;
