function Wallet({
  wallet,
  balance,
  connectWallet,
  disconnectWallet,
  message,
}) {
  return (
    <>
      <h1>Zyntra Wallet</h1>
      <p>Your gateway to the Stellar ecosystem.</p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={connectWallet}>
          Connect Wallet
        </button>

        <button
          onClick={disconnectWallet}
          style={{ marginLeft: "10px" }}
        >
          Disconnect Wallet
        </button>
      </div>

      <p>
        <strong>Wallet:</strong>{" "}
        {wallet || "Not Connected"}
      </p>

      <p>
        <strong>Balance:</strong> {balance} XLM
      </p>

      {message && (
        <p
          style={{
            color: message
              .toLowerCase()
              .includes("success")
              ? "green"
              : "blue",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <hr />
    </>
  );
}

export default Wallet;