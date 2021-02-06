const { ContractFactory } = require("ethers");
const { time } =  require("@openzeppelin/test-helpers");
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
    let yfiAddress = '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e';
    let whaleYfi = '0x19184aB45C40c2920B0E0e31413b9434ABD243eD';
    let lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
    let yearnVault = '0xACd43E627e64355f1861cEC6d3a6688B31a6F952';
    let dataProviderAddress = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d';
    let wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    let aYfiAddress = '0x5165d24277cD063F5ac44Efd447B27025e888f37';
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
        interestRateStrategy = await interestRateStrategy.deploy(ethers.utils.parseEther('0.80'), ethers.utils.parseEther('0.04'), ethers.utils.parseEther('0.02'), ethers.utils.parseEther('0.75'))
        marginPool = await ethers.getContractFactory('MarginPool');
        marginPool = await marginPool.deploy(creditPool.address, '1', interestRateStrategy.address);

        //  debtWEth = await ethers.getContractAt('IStableDebtToken', '0x4e977830ba4bd783C0BB7F15d3e243f73FF57121');

        let dai = new ethers.Contract(daiAddress, Token.abi, provider);
        let weth = new ethers.Contract(wethAddress, Token.abi, provider);
    });


    it("1) should deposit ETH and let whale invest DAI and compute some Interest Rates", async function () {
        const whaleSigner = await impersonateAddress(whaleEthPax);

        let wEthGateway = await ethers.getContractAt('IWETHGateway', '0xDcD33426BA191383f1c9B431A342498fdac73488');
        let aweth = new ethers.Contract(awethAddress, Token.abi, whaleSigner);
        let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
        wEthGateway = wEthGateway.connect(whaleSigner);

        console.log(
          'address is:',
          ethers.utils.getAddress(depositor.address)
        );
        await wEthGateway.depositETH(whaleEthPax, '0', {value: ethers.utils.parseEther('50')});

        aweth = aweth.connect(whaleSigner);
        let aEthBalance = aweth.balanceOf(whaleEthPax);

   // approve credit pool to spend your aweth
       await aweth.approve(creditPool.address, ethers.utils.parseEther('10000'));
       //expect(await(aweth.balanceOf(depositor.address))).to.be.BigNumber.gt(ethers.utils.parseEther('40'));
    // expect(aEthBalance).to.be.bignumber.gt(ethers.utils.parseEther('40'));

        creditPool = creditPool.connect(whaleSigner);

        // last argument is the debt of aWEth token
        await creditPool.deposit(ethers.utils.parseEther('50'), awethAddress, marginPool.address, ethers.utils.parseEther('50'), daiAddress);

//      aEthBalance = await aweth.balanceOf(whaleEthPax);
//    console.log(
//   aEthBalance
//    );
//      expect(aEthBalance).to.be.lt(ethers.utils.parseEther('50'));

        // next can check borrow allowance of margin pool address


       const reserveData = await dataProvider.getReserveTokensAddresses(wethAddress);

       const debtTokenAddress = reserveData.stableDebtTokenAddress;
       debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);
       const allowance = await debtToken.borrowAllowance(creditPool.address, marginPool.address)
       console.log('allowance', allowance.toString())

//    expect(await debtToken.borrowAllowance(creditPool.address, marginPool.address))
//   .to.be.gt(0);



        const daiwhaleSigner = await impersonateAddress(whalePax);
        let dai = new ethers.Contract(daiAddress, Token.abi, daiwhaleSigner);

        await dai.approve(marginPool.address, ethers.utils.parseEther('10000'));
        marginPool = marginPool.connect(daiwhaleSigner);
        await marginPool.invest(
            ethers.utils.parseEther('20'),
            dai.address,
            ethers.utils.parseEther('2'),
            ethers.utils.parseEther('1'),
            172800
        );

        //const userinfo = await marginPool.delegateeDeposits();

        const resultBorrow = await creditPool.getTotalDelegation();
        const result = await marginPool.getTotalBorrowed();
        console.log(
          resultBorrow
        );
        console.log(
          result
        );

        interestRateStrategy = interestRateStrategy.connect(whaleSigner);
        const computedRate = await interestRateStrategy.computeBorrowingRewardRate(ethers.utils.parseEther('20'), ethers.utils.parseEther('50'));
        const depositRate = await interestRateStrategy.computeDepositRewardRate(ethers.utils.parseEther('20'), ethers.utils.parseEther('50'));
        console.log(
          computedRate
        );
        console.log(
          depositRate
        );

        await time.increase(time.duration.days(1));
        await marginPool.repay(
          daiAddress,
          ethers.utils.parseEther('23')
      );

      const pendingDepRate = marginPool.getPendingDepositRate();
      console.log(
        pendingDepRate
      );
      const pendingBorRate = marginPool.getPendingBorrowingRate();
      console.log(
        pendingBorRate
      );
    });

    /*
     it("2) should deposit ETH, get WETH, deposit WETH, delegates WETH and borrower to borrow DAI", async function () {
       const whaleSigner = await impersonateAddress(whaleEthPax);

        let wEthGateway = await ethers.getContractAt('IWETHGateway', '0xDcD33426BA191383f1c9B431A342498fdac73488');
        let aweth = new ethers.Contract(awethAddress, Token.abi, whaleSigner);
        let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
        wEthGateway = wEthGateway.connect(whaleSigner);

       console.log(
         'address is:',
         ethers.utils.getAddress(depositor.address)
       );
        await wEthGateway.depositETH(whaleEthPax, '0', {value: ethers.utils.parseEther('50')});

        aweth = aweth.connect(whaleSigner);
        let aEthBalance = aweth.balanceOf(whaleEthPax);

    // approve credit pool to spend your aweth
        await aweth.approve(creditPool.address, ethers.utils.parseEther('10000'));
       //expect(await(aweth.balanceOf(depositor.address))).to.be.BigNumber.gt(ethers.utils.parseEther('40'));
     // expect(aEthBalance).to.be.bignumber.gt(ethers.utils.parseEther('40'));

        creditPool = creditPool.connect(whaleSigner);

        // last argument is the debt of aWEth token
        await creditPool.deposit(ethers.utils.parseEther('10'), awethAddress, marginPool.address, ethers.utils.parseEther('5'), wethAddress);

        aEthBalance = await aweth.balanceOf(whaleEthPax);
        console.log(
          aEthBalance
        );
        //expect(aEthBalance).to.be.lt(ethers.utils.parseEther('50'));

        // next can check borrow allowance of margin pool address


        const reserveData = await dataProvider.getReserveTokensAddresses(wethAddress);

    const debtTokenAddress = reserveData.stableDebtTokenAddress;
    debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);

    expect(await debtToken.borrowAllowance(creditPool.address, marginPool.address))
      .to.be.gt(0);
    //  // also let borrower comes and invest
    //  //marginPool = marginPool.connect(borrower1);
    //  //await marginPool.invest('100', daiAddress, '', '15'

     });

   it("3) checking for withdrawal reversions", async function () {
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

     //if address that has not deposited tries to withdraw, should revert
     creditPool = creditPool.connect(depositor.address);
     expect(
       creditPool.withdraw('50', adai.address)
     ).to.be.reverted;

     //test what would happen if deposit 100, delegates 50 but try to withdraw 75, will borrowAllowance decreases or tx revert?
   });


   it("4) It is able to withdraw without delegating", async function () {
     const whaleSigner = await impersonateAddress(whalePax);
     let dai = new ethers.Contract(daiAddress, Token.abi, whaleSigner);
     let lendingPool = new ethers.Contract(lendingPoolAddress, lendingPoolABI.abi, whaleSigner);
     let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
     let adai = new ethers.Contract(adaiAddress, Token.abi, whaleSigner);
     await dai.approve(lendingPoolAddress, ethers.utils.parseEther('10000'));
     await lendingPool.deposit(daiAddress, ethers.utils.parseEther('10000'), whalePax, 0);
     await adai.approve(creditPool.address, ethers.utils.parseEther('10000'));

     creditPool = creditPool.connect(whaleSigner);
     await creditPool.deposit(ethers.utils.parseEther('100'), adai.address, marginPool.address, ethers.utils.parseEther('0'), dai.address);

     balance = await adai.balanceOf(whalePax);
     console.log(
        'atoken balance of depositor: ',
          ethers.utils.formatEther(balance)
     );

     const reserveData = await dataProvider.getReserveTokensAddresses(daiAddress);

     const debtTokenAddress = reserveData.stableDebtTokenAddress;
     debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);

     expect(await debtToken.borrowAllowance(creditPool.address, marginPool.address))
       .to.be.equal(0);

     let result = await creditPool.getDepositPerUser(whalePax);
     console.log(
       result
     );

     creditPool = creditPool.connect(whaleSigner);
     await creditPool.withdraw(ethers.utils.parseEther('40'), adai.address);

     result = await creditPool.getDepositPerUser(whalePax);
     console.log(
       result
     );

     //test what would happen if deposit 100, delegates 50 but try to withdraw 75, will borrowAllowance decreases or tx revert?
   });


   it("5) Perform some deposits and borrows and check rates from Interest Rate Strategy calculations", async function () {
     //
     const whaleSignerTest = await impersonateAddress(whaleYfi);
     let yfi = new ethers.Contract(yfiAddress, Token.abi, whaleSignerTest);
     let lendingPool = new ethers.Contract(lendingPoolAddress, lendingPoolABI.abi, whaleSignerTest);
     let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSignerTest);
     let ayfi = new ethers.Contract(aYfiAddress, Token.abi, whaleSignerTest);
     await yfi.approve(lendingPoolAddress, ethers.utils.parseEther('60'));
     await lendingPool.deposit(yfiAddress, ethers.utils.parseEther('50'), whaleYfi, 0);
     await ayfi.approve(creditPool.address, ethers.utils.parseEther('50'));


     creditPool = creditPool.connect(whaleSignerTest);
     await creditPool.deposit(ethers.utils.parseEther('45'), aYfiAddress, marginPool.address, ethers.utils.parseEther('40'), daiAddress);

     const daiwhaleSigner = await impersonateAddress(whalePax);
     let dai = new ethers.Contract(daiAddress, Token.abi, daiwhaleSigner);

     await dai.approve(marginPool.address, ethers.utils.parseEther('10000'));
     marginPool = marginPool.connect(daiwhaleSigner);
     await marginPool.invest(
         ethers.utils.parseEther('20'),
         dai.address,
         ethers.utils.parseEther('2'),
         ethers.utils.parseEther('1'),
         172800
     );
   });

   it("6) should deposit ETH and let whale invest DAI and withdraw the investment", async function () {
    const whaleSigner = await impersonateAddress(whaleEthPax);

    let wEthGateway = await ethers.getContractAt('IWETHGateway', '0xDcD33426BA191383f1c9B431A342498fdac73488');
    let aweth = new ethers.Contract(awethAddress, Token.abi, whaleSigner);
    let dataProvider = new ethers.Contract(dataProviderAddress, dataproviderABI.abi, whaleSigner);
    wEthGateway = wEthGateway.connect(whaleSigner);

    console.log(
      'address is:',
      ethers.utils.getAddress(depositor.address)
    );
    await wEthGateway.depositETH(whaleEthPax, '0', {value: ethers.utils.parseEther('50')});

    aweth = aweth.connect(whaleSigner);
    let aEthBalance = aweth.balanceOf(whaleEthPax);

// approve credit pool to spend your aweth
   await aweth.approve(creditPool.address, ethers.utils.parseEther('10000'));

    creditPool = creditPool.connect(whaleSigner);

    // last argument is the debt of aWEth token
    await creditPool.deposit(ethers.utils.parseEther('50'), awethAddress, marginPool.address, ethers.utils.parseEther('50'), daiAddress);


   const reserveData = await dataProvider.getReserveTokensAddresses(wethAddress);

   const debtTokenAddress = reserveData.stableDebtTokenAddress;
   debtToken = await ethers.getContractAt('IStableDebtToken', debtTokenAddress);
   const allowance = await debtToken.borrowAllowance(creditPool.address, marginPool.address)
   console.log('allowance', allowance.toString())

    const daiwhaleSigner = await impersonateAddress(whalePax);
    let dai = new ethers.Contract(daiAddress, Token.abi, daiwhaleSigner);

    await dai.approve(marginPool.address, ethers.utils.parseEther('10000'));
    marginPool = marginPool.connect(daiwhaleSigner);
    await marginPool.invest(
        ethers.utils.parseEther('20'),
        dai.address,
        ethers.utils.parseEther('2'),
        ethers.utils.parseEther('1'),
        172800
    );

    await time.increase(time.duration.days(2));
    await marginPool.repay(
      daiAddress,
      ethers.utils.parseEther('23')
  );

});

*/


});
