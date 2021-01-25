const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
//const contract = require("packages/hardhat/artifacts/contracts/IERC20.sol/IERC20.json");
var Token = require("../artifacts/contracts/IERC20.sol/IERC20.json");
use(solidity);

const url = "http://127.0.0.1:8545/";
const provider = ethers.providers.getDefaultProvider(url);
const contractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

describe("Credit Pool", function() {
  it('test', async () => {

    let dai = new ethers.Contract(contractAddress, Token.abi, provider);
    //const dai = await ethers.getContractAt('IERC20', '0x6B175474E89094C44Da98b954EedeAC495271d0F');
    //const supply = await dai.totalSupply();

    console.log(
      await dai.totalSupply()
    );

  });
});
