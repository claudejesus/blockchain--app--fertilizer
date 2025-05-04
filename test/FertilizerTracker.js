const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FertilizerTracker", function () {
  let tracker;
  let owner, farmer1;

  beforeEach(async function () {
    [owner, farmer1] = await ethers.getSigners();
    const TrackerFactory = await ethers.getContractFactory("FertilizerTracker");
    tracker = await TrackerFactory.deploy();
    await tracker.waitForDeployment(); // ✅ Required for Ethers v6
  });

  it("should deploy with the correct admin", async function () {
    const admin = await tracker.admin();
    expect(admin).to.equal(owner.address);
  });

  it("should allow a farmer to add a fertilizer record", async function () {
    const tx = await tracker.connect(farmer1).addFertilizerRecord("DAP", 200, "Musanze");
    await tx.wait();

    const totalRecords = await tracker.getTotalRecords();
    expect(totalRecords).to.equal(1);

    const record = await tracker.getRecord(0);
    expect(record.farmer).to.equal(farmer1.address);
    expect(record.fertilizerType).to.equal("DAP");
    expect(record.quantity).to.equal(200);
    expect(record.location).to.equal("Musanze");
  });

  it("should return indexes for a farmer's records", async function () {
    await tracker.connect(farmer1).addFertilizerRecord("NPK", 150, "Huye");
    const indexes = await tracker.getFarmerRecordIndexes(farmer1.address);
    expect(indexes.length).to.equal(1);
    expect(indexes[0]).to.equal(0);
  });
});
