const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp",  () => {
  let MyContract, myContract, addr1, addr2, addr3;


  beforeEach(async () => {
    MyContract = await ethers.getContractFactory('CreditPool');
    myContract = await MyContract.deploy();
    [addr1, addr1, addr3, _] = await ethers.getSigners();
  });

});
