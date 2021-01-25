pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IERC20, ILendingPool, IProtocolDataProvider, IStableDebtToken, YearnVault, AggregatorInterface } from "contracts/Interfaces.sol";
import { SafeERC20} from "contracts/Libraries.sol";

contract MarginPool {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    AggregatorInterface internal fiatDaiRef;

    address public creditPool;
    uint256 public minSolvencyRatio;
    uint256 public totalBorrowedAmount;

    struct Borrower {
        uint256 duration;
        uint256 margin;
        uint256 investment;
        uint256 solvencyRatio;
        bool hasBorrowed;
    }

    mapping(address => Borrower) public delegateeDeposits;

    ILendingPool constant lendingPool = ILendingPool(address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9)); // on mainnet
    IProtocolDataProvider constant dataProvider = IProtocolDataProvider(address(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d)); //on mainnet

    constructor(address _creditPool, uint256 _minSolvencyRatio) public {
        creditPool = _creditPool;
        minSolvencyRatio = _minSolvencyRatio;
        // mainnet dai usd price feed contract to get dai usd rate
        // check https://docs.chain.link/docs/using-chainlink-reference-contracts
        // to get conversion rate from usd to dai call fiatDaiRef.latestAnswer() this would give rate for 1 usd
        fiatDaiRef = AggregatorInterface(address(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9));
    }
    // to be called by a borrower with the duration in seconds and amount they wish to borrow
    // margin amount will be 10 % of _amount calculated on front end to avoid soldity decimal issue
    // _vault can be dai vault address to start off
    // _asset is the stable coin they wish to borrow
    // borrow for a particular borrower will be allowed once for a particular borrower
    function invest(uint256 _amount, address _asset, address _vault, uint256 _marginAmount, uint256 _duration) public {
      // get atoken address
      (address _debtToken, ,) =  dataProvider.getReserveTokensAddresses(_asset);
      // get the borrowing allowance
      uint256 _delegatedAmount = IStableDebtToken(_debtToken).borrowAllowance(creditPool, address(this));
      require(_delegatedAmount >= totalBorrowedAmount, "MarginPool: insufficient debt allowance");
      // compute the solvency ratio added this buffere 10^5 since solidity does not handle decimal places
      // so to render solvency ratio on ui we need to divide by 10^5 in the js code 
      uint256 solvencyRatio = (_amount.mul(100000)).add(_marginAmount).div(_amount);
      require(solvencyRatio >= minSolvencyRatio.mul(100000), "MarginPool: insufficient margin amount");
      // getting the actual timestamp for the duration
      uint256 duration = block.timestamp.add(_duration);
      // checking if the borrower already exists
      Borrower memory borrower = delegateeDeposits[msg.sender];
      require(!borrower.hasBorrowed, "MarginPool: borrower has borrowed previously");
      // strong borrowe details in storage
      delegateeDeposits[msg.sender] = Borrower(duration, _marginAmount, _amount.add(_marginAmount), solvencyRatio, true);
      // setting total borrowed amount in storage
      totalBorrowedAmount += _amount;
      // getting the delgated credit amount from aave
      lendingPool.borrow(_asset, _amount, 1, 0, creditPool);
      // investing to yearn vault
      YearnVault(_vault).deposit(_amount.add(_marginAmount));
    }
    // to be called by borrower to repay the borrowed
    //NOTE - this does not include reward distribution currently
    // to be called before the duration ends to avoid chances of liquidation
    // every time repay will be called it will be to repay the complete amount
    function repay(address _asset, address _vault) public {
        Borrower storage borrower = delegateeDeposits[msg.sender];
        require(borrower.duration > block.timestamp, "MarginPool: borrow duration has exceeded you will be liquidated");
        borrower.duration = 0;
        uint256 margin = borrower.margin;
        borrower.margin = 0;
        uint256 investment = borrower.investment;
        borrower.investment = 0;
        borrower.solvencyRatio = 0;
        borrower.hasBorrowed = false;
        // withdrawing yield amount from yearn
        YearnVault(_vault).withdraw(investment);
        // repaying credit  pool the borrowed funds
        lendingPool.repay(_asset, investment.sub(margin), 1, creditPool);
    }


}