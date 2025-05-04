const hre = require("hardhat");

async function main() {
  const Tracker = await hre.ethers.getContractFactory("FertilizerTracker");

  const tracker = await hre.ethers.deployContract("FertilizerTracker");

  await tracker.waitForDeployment(); // ✅ replaces .deployed()

  console.log("FertilizerTracker deployed to:", await tracker.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
