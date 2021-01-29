const { ContractFactory } = require("ethers");
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const cp = require("../artifacts/contracts/CreditPool.sol/CreditPool.json")
//const CreditPool = require("../artifacts/contracts/CreditPool.sol/CreditPool.json");
//const MarginPool = require("../artifacts/contracts/MarginPool.sol/MarginPool.json");
//const factoryCredit = new ContractFactory('packages/hardhat/artifacts/contracts/CreditPool.sol/CreditPool.json', 'packages/hardhat/artifacts/build-info/0c305e3aa22d6927312ec29b726b6234.json');
const impersonateAddress = async (address) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  });
  const signer = await ethers.provider.getSigner(address);
  signer.address = signer._address;
  return signer;
};

//const contract = require("packages/hardhat/artifacts/contracts/IERC20.sol/IERC20.json");
var Token = require("../artifacts/contracts/Interfaces.sol/IERC20.json");
var AaveWETH = require("../artifacts/contracts/Interfaces.sol/IWETHGateway.json");
use(solidity);
const url = "http://127.0.0.1:8545/";
const provider = ethers.providers.getDefaultProvider(url);
const daiContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const aDaiContractAddress = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';
//const wEthGateway = '0xDcD33426BA191383f1c9B431A342498fdac73488';

describe("Mainnet fork testing", function() {
  const me = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //first account
  const whale = '0x5F7dc48Fe7396e7CE64a40195BEA153702fC118f'; //dai whale on chain

  it('test', async () => {
    let dai = new ethers.Contract(daiContractAddress, Token.abi, provider);
    //let dai = await ethers.getContractAt('IERC20.sol:IERC20', '0x6B175474E89094C44Da98b954EedeAC495271d0F');
	const whaleSigner = await impersonateAddress(whale);
	const balance = await dai.balanceOf(me);
  const balanceEth = await provider.getBalance(me);
  const balanceWhale = await dai.balanceOf(whale);
  const balanceWhaleEth = await provider.getBalance(whale);
  const tx = {
    to: whaleSigner.address,
    value: ethers.utils.parseEther('100'),
    gasPrice: 85000000000,
    gasLimit: 9500000,
  };
  const privKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  let wallet = new ethers.Wallet(privKey, provider);
  //const receipt = await wallet.sendTransaction(tx);
  const supply = await dai.totalSupply();
  console.log(
    ethers.utils.formatEther(supply)
  );
	console.log(
		'our very own balance (before):',
		ethers.utils.formatEther(balance)
	);
  console.log(
		'our very own ETH balance (before):',
		ethers.utils.formatEther(balanceEth)
	);
  console.log(
		'Dai balance of whale(before):',
		ethers.utils.formatEther(balanceWhale)
	);
  console.log(
    'Eth balance of whale(before):',
    ethers.utils.formatEther(balanceWhaleEth)
  );
	dai = dai.connect(whaleSigner);
	await dai.transfer(me, ethers.utils.parseEther('50000'));
	balance = await dai.balanceOf(me);
	console.log(
		'our very own balance (after): ',
		ethers.utils.formatEther(balance)
	);
  });
});

describe("Credit Delegation flow", function() {
	let lendingPool, DataProvider, CreditPool, MarginPool;
	let depositor, borrower1, borrower2;
	let whalePax = '0x5F7dc48Fe7396e7CE64a40195BEA153702fC118f';
	let daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
	let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	let awethAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e';
	const me = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //first account

	before('connect to signers', async () => {
		([_, depositor, borrower1, borrower2] = await ethers.getSigners());
	});

	before("Deploy contracts", async function () {
		CreditPool = await ethers.getContractFactory('CreditPool');
		creditPool = await CreditPool.deploy();
		MarginPool = await ethers.getContractFactory('MarginPool');
		marginPool = await MarginPool.deploy(creditPool.address, '10');

		const lendingPool = await ethers.getContractAt('ILendingPool', '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
		const debtWEth = await ethers.getContractAt('IStableDebtToken', '0x4e977830ba4bd783C0BB7F15d3e243f73FF57121');

		let dai = new ethers.Contract(daiAddress, Token.abi, provider);
		let weth = new ethers.Contract(wethAddress, Token.abi, provider);
	});


	it("should deposit", async function () {
    let dai = new ethers.Contract(daiAddress, Token.abi, provider);
		const whaleGuy = await impersonateAddress(whalePax);
		dai = dai.connect(whaleGuy);
    // .address else we will get "invalid ENS name error"
		await dai.transfer(depositor.address, ethers.utils.parseEther('1'));
		balance = await dai.balanceOf(depositor.address);
		console.log(
			'balance of depositor: ',
			ethers.utils.formatEther(balance)
		);
		await lendingPool.deposit(daiAddress, '100000', depositor.address, 0);
		const userData = await lendingPool.getUserAccountData(depositor.address);
		expect(
			userData.totalCollateralETH
			).to.be.gt(0);
		await creditPool.deposit('50000', '0x028171bCA77440897B824Ca71D1c56caC55b68A3', marginPool.address, '20000', '0x778A13D3eeb110A4f7bb6529F99c000119a08E92');
	});


	it("should deposit ETH, get WETH, deposit WETH, delegates WETH and borrower to borrow DAI", async function () {

		const depositAmount = ethers.utils.parseEther('50');
		//const zero = BigNumber.from('0');

		//depositor = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

		let wEthGateway = await ethers.getContractAt('IWETHGateway', '0xDcD33426BA191383f1c9B431A342498fdac73488');
		let aweth = new ethers.Contract(awethAddress, Token.abi, provider);
		wEthGateway = wEthGateway.connect(depositor);

    console.log(
      'address is:',
      ethers.utils.getAddress(depositor.address)
    );
		await wEthGateway.depositETH(depositor.address, '0', {value: ethers.utils.parseEther('50')});

    aweth = aweth.connect(depositor);
		let aEthBalance = aweth.balanceOf(depositor.address);
    /*
		console.log(
			'aweth balance post eth deposit:',
			ethers.utils.formatEther(aEthBalance)
		);
    */
		expect(await(aweth.balanceOf(depositor.address))).to.be.gt('40');

		creditPool = creditPool.connect(depositor);

		// last argument is the debt of aWEth token
		await creditPool.deposit('10', awethAddress, marginPool.address, '5', '0x4e977830ba4bd783C0BB7F15d3e243f73FF57121');

		aEthBalance = aweth.balanceOf(depositor.address);
		expect(aEthBalance).to.be.lt(depositAmount);

		// next can check borrow allowance of margin pool address

		let debtAllowanceBefore = await debtWEth.borrowAllowance(depositor.address, marginPool.address);
		expect(debtAllowanceBefore).to.be.gt('0');

		// also let borrower comes and invest
		//marginPool = marginPool.connect(borrower1);
		//await marginPool.invest('100', daiAddress, '', '15'

	});


});
