const { ContractFactory } = require("ethers");
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const cp = require("../artifacts/contracts/CreditPool.sol/CreditPool.json")

const impersonateAddress = async (address) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
});

const signer = await ethers.provider.getSigner(address);
signer.address = signer._address;
return signer;
};

var Token = require("../artifacts/contracts/Interfaces.sol/IERC20.json");
var lendingPoolABI = require("../artifacts/contracts/Interfaces.sol/ILendingPool.json");
var debttokenABI = require("../artifacts/contracts/Interfaces.sol/IStableDebtToken.json");
var dataproviderABI = require("../artifacts/contracts/Interfaces.sol/IProtocolDataProvider.json");
var AaveWETH = require("../artifacts/contracts/Interfaces.sol/IWETHGateway.json");
use(solidity);
const url = "http://127.0.0.1:8545/";
const provider = ethers.provider;


describe("Credit Delegation flow", function() {
	let lendingPool, DataProvider, creditPool, marginPool, interestRateStrategy;
	let depositor, borrower1, borrower2;
	let whalePax = '0x5F7dc48Fe7396e7CE64a40195BEA153702fC118f';
  let whaleEthPax = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';
	let daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
	let lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
  let yearnVault = '0xACd43E627e64355f1861cEC6d3a6688B31a6F952';
  let dataProviderAddress = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d';
	let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	let awethAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e';
	let adaiAddress = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';
	let debttokenAddress = '0x778A13D3eeb110A4f7bb6529F99c000119a08E92';
	const me = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //first account
	// const accounts = await ethers.getSigners();


	before('connect to signers', async () => {
		([_, depositor, borrower1, borrower2] = await ethers.getSigners());
	});

	before("Deploy contracts", async function () {
		creditPool = await ethers.getContractFactory('CreditPool');
		creditPool = await creditPool.deploy();
		// margin pool takes in interest strategy address now too so need that in constructor
		interestRateStrategy = await ethers.getContractFactory('InterestRateStrategy');
		interestRateStrategy = await interestRateStrategy.deploy(80, 4, 2, 75)
		marginPool = await ethers.getContractFactory('MarginPool');
		marginPool = await marginPool.deploy(creditPool.address, '1', interestRateStrategy.address);

		//  debtWEth = await ethers.getContractAt('IStableDebtToken', '0x4e977830ba4bd783C0BB7F15d3e243f73FF57121');

		let dai = new ethers.Contract(daiAddress, Token.abi, provider);
		let weth = new ethers.Contract(wethAddress, Token.abi, provider);
	});


	it("should deposit", async function () {
		const whaleSigner = await impersonateAddress(whalePax);

		// for using external mainnet contract with forking use this and not getContractAt
		let dai = new ethers.Contract(daiAddress, Token.abi, whaleSigner);
		// get lending pool instance
		let lendingPool = new ethers.Contract(lendingPoolAddress, lendingPoolABI.abi, whaleSigner);
    let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
		// get dai instance
		let adai = new ethers.Contract(adaiAddress, Token.abi, whaleSigner);
		// approve lending pool to spend your dai
		await dai.approve(lendingPoolAddress, ethers.utils.parseEther('10000'));
		// deposit to aave and get adai
		await lendingPool.deposit(daiAddress, ethers.utils.parseEther('10000'), whalePax, 0);
		const userData = await lendingPool.getUserAccountData(whalePax);
		balance = await adai.balanceOf(whalePax);
		expect(
			userData.totalCollateralETH
			).to.be.gt(0);
		console.log(
				'atoken balance of depositor: ',
				ethers.utils.formatEther(balance)
		);
		// approve credit pool to spend your adai
		await adai.approve(creditPool.address, ethers.utils.parseEther('10000'));
		console.log(
			'atoken balance of depositor: ',
			ethers.utils.formatEther(balance)
	);
		// deposit to credit pool
    creditPool = creditPool.connect(whaleSigner);
		await creditPool.deposit(ethers.utils.parseEther('100'), adai.address, marginPool.address, ethers.utils.parseEther('75'), dai.address);

    balance = await adai.balanceOf(whalePax);
		console.log(
			'atoken balance of depositor: ',
			ethers.utils.formatEther(balance)
	  );

    const reserveData = await dataProvider.getReserveTokensAddresses(daiAddress);

    const debtTokenAddress = reserveData.stableDebtTokenAddress;
    debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);

    expect(await debtToken.borrowAllowance(creditPool.address, marginPool.address))
      .to.be.gt(0);
    /*
    await marginPool.invest(
        ethers.utils.parseEther('50'),
        dai.address,
        ethers.utils.parseEther('5'),
        ethers.utils.parseEther('1'),
        172800
    );
    const userinfo = await marginPool.delegateeDeposits();
    */
	});


	 it("should deposit ETH, get WETH, deposit WETH, delegates WETH and borrower to borrow DAI", async function () {
    const whaleSigner = await impersonateAddress(whaleEthPax);
	 	const depositAmount = ethers.utils.parseEther('50');
	 	//const zero = BigNumber.from('0');

	 	//depositor = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

	 	let wEthGateway = await ethers.getContractAt('IWETHGateway', '0xDcD33426BA191383f1c9B431A342498fdac73488');
	 	let aweth = new ethers.Contract(awethAddress, Token.abi, whaleSigner);
	 	wEthGateway = wEthGateway.connect(whaleSigner);

     console.log(
       'address is:',
       ethers.utils.getAddress(depositor.address)
     );
	 	await wEthGateway.depositETH(whaleEthPax, '0', {value: ethers.utils.parseEther('50')});

    aweth = aweth.connect(whaleSigner);
	 	let aEthBalance = aweth.balanceOf(whaleEthPax);

		console.log(
			'aweth balance post eth deposit:',
			ethers.utils.formatEther(aEthBalance)
	 	);

 	   //expect(await(aweth.balanceOf(depositor.address))).to.be.BigNumber.gt(ethers.utils.parseEther('40'));
     // expect(aEthBalance).to.be.bignumber.gt(ethers.utils.parseEther('40'));

	 	creditPool = creditPool.connect(whaleEthPax);

	 	// last argument is the debt of aWEth token
	 	await creditPool.deposit('10', awethAddress, marginPool.address, '5', '0x4e977830ba4bd783C0BB7F15d3e243f73FF57121');

	 	aEthBalance = aweth.balanceOf(depositor.address);
	 	expect(aEthBalance).to.be.lt(depositAmount);

	 	// next can check borrow allowance of margin pool address

	 	let debtAllowanceBefore = await debtWEth.borrowAllowance(depositor.address, marginPool.address);
	 	expect(debtAllowanceBefore).to.be.gt('0');

	// 	// also let borrower comes and invest
	// 	//marginPool = marginPool.connect(borrower1);
	// 	//await marginPool.invest('100', daiAddress, '', '15'

	 });

   it("checking for withdrawal reversions", async function () {
     const whaleSigner = await impersonateAddress(whalePax);
 		 let dai = new ethers.Contract(daiAddress, Token.abi, whaleSigner);
 		 let lendingPool = new ethers.Contract(lendingPoolAddress, lendingPoolABI.abi, whaleSigner);
     let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
 		 let adai = new ethers.Contract(adaiAddress, Token.abi, whaleSigner);
 		 await dai.approve(lendingPoolAddress, ethers.utils.parseEther('10000'));
 		 await lendingPool.deposit(daiAddress, ethers.utils.parseEther('10000'), whalePax, 0);
     await adai.approve(creditPool.address, ethers.utils.parseEther('10000'));

     creditPool = creditPool.connect(whaleSigner);
 		 await creditPool.deposit(ethers.utils.parseEther('100'), adai.address, marginPool.address, ethers.utils.parseEther('50'), dai.address);

     balance = await adai.balanceOf(whalePax);
 		 console.log(
 			'atoken balance of depositor: ',
 			 ethers.utils.formatEther(balance)
 	   );

     const reserveData = await dataProvider.getReserveTokensAddresses(daiAddress);

     const debtTokenAddress = reserveData.stableDebtTokenAddress;
     debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);

     expect(await debtToken.borrowAllowance(creditPool.address, marginPool.address))
       .to.be.gt(0);

     //should revert if tries to withdraw higher than deposited
     expect(
       creditPool.withdraw('150', adai.address)
     ).to.be.reverted;

     expect(
       creditPool.withdraw('75', adai.address)
     ).to.be.reverted;

     //await creditPool.withdraw('25', adai.address);

     //if address that has not deposited tries to withdraw, should revert
     creditPool = creditPool.connect(depositor.address);
     expect(
       creditPool.withdraw('50', adai.address)
     ).to.be.reverted;

     //test what would happen if deposit 100, delegates 50 but try to withdraw 75, will borrowAllowance decreases or tx revert?
   });


});
