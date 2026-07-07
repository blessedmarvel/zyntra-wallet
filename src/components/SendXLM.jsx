function SendXLM({
  recipient,
  amount,
  setRecipient,
  setAmount,
  sendXLM,
}) {
  return (
    <>
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
    </>
  );
}

export default SendXLM;