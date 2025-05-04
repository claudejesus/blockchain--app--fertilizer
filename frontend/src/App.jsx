// src/App.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FertilizerTracker from "./FertilizerTracker.json"; // ABI

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [account, setAccount] = useState(null);
  const [fertilizerType, setFertilizerType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [records, setRecords] = useState([]);

  const [contract, setContract] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const [selectedAccount] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const instance = new ethers.Contract(
        CONTRACT_ADDRESS,
        FertilizerTracker.abi,
        signer
      );
      setContract(instance);
    } else {
      alert("MetaMask not detected");
    }
  };

  // Add record
  const addRecord = async () => {
    if (contract && fertilizerType && quantity && location) {
      const tx = await contract.addFertilizerRecord(
        fertilizerType,
        ethers.BigNumber.from(quantity),
        location
      );
      await tx.wait();
      alert("Record added!");
      fetchRecords();
    }
  };

  // Fetch records for this user
  const fetchRecords = async () => {
    if (contract && account) {
      const indexes = await contract.getFarmerRecordIndexes(account);
      const fetched = await Promise.all(
        indexes.map(async (i) => {
          const r = await contract.getRecord(i);
          return {
            fertilizerType: r.fertilizerType,
            quantity: r.quantity.toString(),
            location: r.location,
            timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString(),
          };
        })
      );
      setRecords(fetched);
    }
  };

  useEffect(() => {
    if (account) {
      fetchRecords();
    }
  }, [contract, account]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🌱 Fertilizer Tracker DApp</h1>
      {account ? (
        <p className="mb-4">Connected: {account}</p>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Add Fertilizer Record</h2>
        <input
          placeholder="Fertilizer Type"
          value={fertilizerType}
          onChange={(e) => setFertilizerType(e.target.value)}
          className="block border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block border p-2 w-full mb-2"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block border p-2 w-full mb-2"
        />
        <button
          onClick={addRecord}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Record
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📋 Your Records</h2>
        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <ul className="space-y-3">
            {records.map((r, i) => (
              <li key={i} className="p-4 border rounded">
                <p><strong>Type:</strong> {r.fertilizerType}</p>
                <p><strong>Quantity:</strong> {r.quantity}</p>
                <p><strong>Location:</strong> {r.location}</p>
                <p><strong>Time:</strong> {r.timestamp}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
