function TransactionHistory({ transactions }) {
  return (
    <>
      <hr />
      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((tx, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Recipient:</strong> {tx.recipient}</p>
            <p><strong>Amount:</strong> {tx.amount} XLM</p>
            <p><strong>Status:</strong> {tx.status}</p>
            <p><strong>Hash:</strong> {tx.hash}</p>
          </div>
        ))
      )}
    </>
  );
}

export default TransactionHistory;