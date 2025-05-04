require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const ABI = require("./FertilizerTracker.json"); // ABI from artifacts

const provider = new ethers.JsonRpcProvider("http://localhost:8546");
const signer = provider.getSigner(); // default first account
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, await signer);

app.post("/add", async (req, res) => {
  const { fertilizerType, quantity, location } = req.body;
  try {
    const tx = await contract.addFertilizerRecord(fertilizerType, quantity, location);
    await tx.wait();
    res.send({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/records", async (req, res) => {
  const total = await contract.getTotalRecords();
  const results = [];
  for (let i = 0; i < total; i++) {
    const record = await contract.getRecord(i);
    results.push(record);
  }
  res.send(results);
});

app.listen(3001, () => {
  console.log("Backend API listening on port 3001");
});
