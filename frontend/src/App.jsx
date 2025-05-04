
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import FertilizerTracker from "../../artifacts/contracts/FertilizerTracker.sol/FertilizerTracker.json";
// import "./App.css";

// const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// function App() {
//   const [currentAccount, setCurrentAccount] = useState("");
//   const [contract, setContract] = useState(null);
//   const [fertilizerType, setFertilizerType] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [location, setLocation] = useState("");
//   const [records, setRecords] = useState([]);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     connectWallet();
//   }, []);

//   const connectWallet = async () => {
//     try {
//       const { ethereum } = window;
//       if (!ethereum) return alert("MetaMask not detected.");

//       const accounts = await ethereum.request({ method: "eth_requestAccounts" });
//       setCurrentAccount(accounts[0]);

//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const signer = provider.getSigner();
//       const trackerContract = new ethers.Contract(contractAddress, FertilizerTracker.abi, signer);

//       setContract(trackerContract);
//       fetchRecords(trackerContract, accounts[0]);
//     } catch (error) {
//       console.error("Wallet connection failed:", error);
//     }
//   };

//   const addRecord = async () => {
//     if (!contract || !fertilizerType || !quantity || !location) {
//       return alert("Please fill in all fields.");
//     }

//     try {
//       const tx = await contract.addFertilizerRecord(
//         fertilizerType,
//         ethers.BigNumber.from(quantity),
//         location
//       );
//       await tx.wait();
//       alert("Fertilizer record added!");
//       fetchRecords(contract, currentAccount);
//     } catch (error) {
//       console.error("Error adding record:", error);
//       alert("Transaction failed.");
//     }
//   };

//   const fetchRecords = async (tracker = contract, address = currentAccount) => {
//     if (!tracker || !address) return;

//     try {
//       const totalRecords = await tracker.getTotalRecord(address);
//       setTotal(totalRecords.toNumber());

//       const fetchedRecords = [];
//       for (let i = 0; i < totalRecords; i++) {
//         const record = await tracker.getRecord(address, i);
//         fetchedRecords.push({
//           type: record.fertilizerType,
//           quantity: record.quantity.toString(),
//           location: record.location,
//           timestamp: new Date(record.timestamp.toNumber() * 1000).toLocaleString(),
//         });
//       }

//       setRecords(fetchedRecords);
//     } catch (error) {
//       console.error("Error fetching records:", error);
//     }
//   };

//   return (
//     <div className="app">
//       <h1>🌱 Fertilizer Tracker DApp</h1>

//       {!currentAccount ? (
//         <button onClick={connectWallet}>Connect Wallet</button>
//       ) : (
//         <div>
//           <p><strong>Connected:</strong> {currentAccount}</p>

//           <div className="form">
//             <input
//               type="text"
//               placeholder="Fertilizer Type"
//               value={fertilizerType}
//               onChange={(e) => setFertilizerType(e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//             />
//             <button onClick={addRecord}>Add Record</button>
//           </div>

//           <h2>Total Records: {total}</h2>
//           <div className="records">
//             {records.length > 0 ? (
//               records.map((rec, index) => (
//                 <div key={index} className="record-card">
//                   <p><strong>Type:</strong> {rec.type}</p>
//                   <p><strong>Qty:</strong> {rec.quantity}</p>
//                   <p><strong>Location:</strong> {rec.location}</p>
//                   <p><strong>Time:</strong> {rec.timestamp}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No records yet.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FertilizerTracker from "../../artifacts/contracts/FertilizerTracker.sol/FertilizerTracker.json";
import "./App.css";

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [fertilizerType, setFertilizerType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const handleAddRecord = async () => {
    if (!fertilizerType || !quantity || !location) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FertilizerTracker.abi, signer);

      const timestamp = Math.floor(Date.now() / 1000); // Unix time
      const tx = await contract.addFertilizerRecord(fertilizerType, quantity, location, timestamp);
      await tx.wait();

      setFertilizerType("");
      setQuantity("");
      setLocation("");
      setError("");
      fetchRecords(); // Refresh records
    } catch (err) {
      console.error(err);
      setError("Error adding record. Check console.");
    }
  };

  const fetchRecords = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, FertilizerTracker.abi, provider);
      const total = await contract.getTotalRecord();

      const items = [];
      for (let i = 0; i < total; i++) {
        const record = await contract.getRecord(i);
        items.push(record);
      }

      setRecords(items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="app">
      <h1>🌿 Fertilizer Tracker DApp</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Fertilizer Type"
          value={fertilizerType}
          onChange={(e) => setFertilizerType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity (kg)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleAddRecord}>➕ Add Record</button>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="records">
        <h2>📋 Fertilizer Records</h2>
        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <ul>
            {records.map((r, i) => (
              <li key={i}>
                <strong>{r.fertilizerType}</strong> - {r.quantity}kg - {r.location} -{" "}
                {new Date(Number(r.timestamp) * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
