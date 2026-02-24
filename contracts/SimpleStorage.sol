
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.28;

import "hardhat/console.sol"
;
contract SimpleStorage {
    uint256 public storeddata;

    constructor(uint256 _stored) {
        console.log("Developed by: ",msg.sender);
        console.log("Deployed by value: %s", _stored);
        storeddata=_stored;
    }
    function set(uint256 x) public{
        console.log("Set value to: %s",x);
        storeddata = x;
    }
    function get() public view  returns(uint256){
        console.log("Retrived value is: %s",storeddata);
        return storeddata ;
    }

}