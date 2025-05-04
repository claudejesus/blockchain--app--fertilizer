// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract FertilizerTracker {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct FertilizerRecord {
        address farmer;
        string fertilizerType;
        uint256 quantity;
        string location;
        uint256 timestamp;
    }

    FertilizerRecord[] public records;

    mapping(address => uint256[]) public farmerToRecords;

    event FertilizerAdded(
        address indexed farmer,
        string fertilizerType,
        uint256 quantity,
        string location,
        uint256 timestamp
    );

    function addFertilizerRecord(
        string memory _fertilizerType,
        uint256 _quantity,
        string memory _location
    ) public {
        FertilizerRecord memory newRecord = FertilizerRecord({
            farmer: msg.sender,
            fertilizerType: _fertilizerType,
            quantity: _quantity,
            location: _location,
            timestamp: block.timestamp
        });

        records.push(newRecord);
        farmerToRecords[msg.sender].push(records.length - 1);

        emit FertilizerAdded(
            msg.sender,
            _fertilizerType,
            _quantity,
            _location,
            block.timestamp
        );
    }

    function getRecord(uint256 index) public view returns (
        address farmer,
        string memory fertilizerType,
        uint256 quantity,
        string memory location,
        uint256 timestamp
    ) {
        FertilizerRecord memory r = records[index];
        return (r.farmer, r.fertilizerType, r.quantity, r.location, r.timestamp);
    }

    function getFarmerRecordIndexes(address _farmer) public view returns (uint256[] memory) {
        return farmerToRecords[_farmer];
    }

    function getTotalRecords() public view returns (uint256) {
        return records.length;
    }
}
