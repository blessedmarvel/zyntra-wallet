import TransactionHistory from "./components/TransactionHistory";
import SendXLM from "./components/SendXLM";
import Wallet from "./components/Wallet";
import { useState } from "react";
import {
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

function App() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
const [transactions, setTransactions] = useState([]);
  const connectWallet = async () => {
    try {
      const server = new Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );

      const result = await requestAccess();

      if (result.error) {
        alert(result.error.message);
        return;
      }

      setWallet(result.address);

      const account = await server.loadAccount(result.address);

      const xlm = account.balances.find(
        (asset) => asset.asset_type === "native"
      );

      if (xlm) {
        setBalance(xlm.balance);
      }

      setMessage("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to connect wallet.");
    }
  };

  const disconnectWallet = () => {
    setWallet("");
    setBalance("0");
    setRecipient("");
    setAmount("");
    setMessage("Wallet disconnected.");
  };

  const sendXLM = async () => {
    try {
      if (!wallet) {
        setMessage("Please connect your wallet first.");
        return;
      }

      if (!recipient || !amount) {
        setMessage("Please enter a recipient and amount.");
        return;
      }
if (Number(amount) <= 0) {
  setMessage("Amount must be greater than zero.");
  return;
}
if (Number(amount) > Number(balance)) {
  setMessage("Insufficient balance.");
  return;
}
      const server = new Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );

      const sourceAccount = await server.loadAccount(wallet);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      const signed = await signTransaction(transaction.toXDR(), {
        networkPassphrase: Networks.TESTNET,
        address: wallet,
      });

      if (signed.error) {
        setMessage(signed.error.message);
        return;
      }

      const signedTx = TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        Networks.TESTNET
      );
setMessage("⏳ Transaction Pending...");
      const response = await server.submitTransaction(signedTx);

      setMessage("✅ Transaction Successful!");
setTransactions((prev) => [
  {
    recipient,
    amount,
    hash: response.hash,
    status: "Success",
  },
  ...prev,
]);
      const updated = await server.loadAccount(wallet);

      const xlm = updated.balances.find(
        (asset) => asset.asset_type === "native"
      );

      if (xlm) {
        setBalance(xlm.balance);
      }

      setAmount("");
      setRecipient("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Transaction Failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <Wallet
  wallet={wallet}
  balance={balance}
  connectWallet={connectWallet}
  disconnectWallet={disconnectWallet}
  message={message}
/>

     <SendXLM
  recipient={recipient}
  amount={amount}
  setRecipient={setRecipient}
  setAmount={setAmount}
  sendXLM={sendXLM}
/><TransactionHistory transactions={transactions} />
    </div>
  );
}

export default App;