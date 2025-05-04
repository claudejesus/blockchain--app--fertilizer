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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // ✅ Admin adds a fertilizer record for a farmer
    function addFarmerRecord(
        address _farmer,
        string memory _fertilizerType,
        uint256 _quantity,
        string memory _location
    ) public onlyAdmin {
        _addRecord(_farmer, _fertilizerType, _quantity, _location);
    }

    // ✅ Farmer registers their own record
    function registerMyRecord(
        string memory _fertilizerType,
        uint256 _quantity,
        string memory _location
    ) public {
        _addRecord(msg.sender, _fertilizerType, _quantity, _location);
    }

    // ✅ Internal function to avoid duplicate code
    function _addRecord(
        address _farmer,
        string memory _fertilizerType,
        uint256 _quantity,
        string memory _location
    ) internal {
        FertilizerRecord memory newRecord = FertilizerRecord({
            farmer: _farmer,
            fertilizerType: _fertilizerType,
            quantity: _quantity,
            location: _location,
            timestamp: block.timestamp
        });

        records.push(newRecord);
        farmerToRecords[_farmer].push(records.length - 1);

        emit FertilizerAdded(
            _farmer,
            _fertilizerType,
            _quantity,
            _location,
            block.timestamp
        );
    }

    // ✅ View a specific record
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

    // ✅ Get indexes of a farmer's records
    function getFarmerRecordIndexes(address _farmer) public view returns (uint256[] memory) {
        return farmerToRecords[_farmer];
    }

    // ✅ View all records for a specific farmer
    function viewFarmerRecords(address _farmer) public view returns (FertilizerRecord[] memory) {
        uint256[] memory indexes = farmerToRecords[_farmer];
        FertilizerRecord[] memory result = new FertilizerRecord[](indexes.length);

        for (uint256 i = 0; i < indexes.length; i++) {
            result[i] = records[indexes[i]];
        }

        return result;
    }

    // ✅ Total number of records
    function getTotalRecords() public view returns (uint256) {
        return records.length;
    }
}