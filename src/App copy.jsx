import { useState } from "react";
import {
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

import {
  Horizon,
  Transaction,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";s
function App() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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

    const signed = await signTransaction(
      transaction.toXDR(),
      {
        network: "TESTNET",
        address: wallet,
      }
    );

    if (signed.error) {
      setMessage(signed.error.message);
      return;
    }

    const signedTx = TransactionBuilder.fromXDR(
      signed.signedTxXdr,
      Networks.TESTNET
    );

    const response = await server.submitTransaction(signedTx);

    setMessage(
      `Success! Transaction Hash: ${response.hash}`
    );

    // Refresh balance
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
    setMessage(err.message || "Transaction failed.");
  }
};
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>⭐ Stellar White Belt</h1>

      <div style={{ marginBottom: "20px" }}>
  <button onClick={connectWallet}>Connect Wallet</button>

  <button
    onClick={disconnectWallet}
    style={{ marginLeft: "10px" }}
  >
    Disconnect Wallet
  </button>
</div>

      <p>
        <strong>Wallet:</strong>{" "}
        {wallet ? wallet : "Not Connected"}
      </p>

      <p>
        <strong>Balance:</strong> {balance} XLM
      </p>

      {message && (
  <p
    style={{
      color: message.toLowerCase().includes("success")
        ? "green"
        : "blue",
      fontWeight: "bold",
    }}
  >
    {message}
  </p>
)}

      <hr />

      <h2>Send XLM</h2>

      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <button onClick={sendXLM}>Send XLM</button>
    </div>
  );
}

export default App;