pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    IERC20,
    ILendingPool,
    IProtocolDataProvider,
    IStableDebtToken,
    YearnVault,
    AggregatorInterface,
    YearnController
} from "contracts/Interfaces.sol";
import {SafeERC20} from "contracts/Libraries.sol";
import {InterestRateStrategy} from "./InterestRateStrategy.sol";
import "hardhat/console.sol";


contract MarginPool {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public creditPool;
    uint256 public minSolvencyRatio;
    uint256 public totalBorrowedAmount;

    struct Borrower {
        uint256 duration;
        uint256 margin;
        uint256 investment;
        uint256 solvencyRatio;
        uint256 interestAmount;
        bool hasBorrowed;
    }

    uint256 public pendingDepositRate;
    uint256 public pendingBorrowingRate;

    mapping(address => Borrower) public delegateeDeposits;

    InterestRateStrategy public interestRateStrategy;

    ILendingPool constant lendingPool = ILendingPool(
        address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9)
    ); // on mainnet
    IProtocolDataProvider constant dataProvider = IProtocolDataProvider(
        address(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d)
    ); //on mainnet
    YearnVault constant daiVault = YearnVault(
        address(0xACd43E627e64355f1861cEC6d3a6688B31a6F952)
    ); // on mainnet
    AggregatorInterface constant fiatDaiRef = AggregatorInterface(
        address(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9)
    ); // on mainnet

    constructor(
        address _creditPool,
        uint256 _minSolvencyRatio,
        address _interestRateStrategy
    ) public {
        creditPool = _creditPool;
        minSolvencyRatio = _minSolvencyRatio;
        interestRateStrategy = InterestRateStrategy(
            address(_interestRateStrategy)
        );
        // mainnet dai usd price feed contract to get dai usd rate
        // check https://docs.chain.link/docs/using-chainlink-reference-contracts
        // to get conversion rate from usd to dai call fiatDaiRef.latestAnswer() this would give rate for 1 usd
    }

    /**
     * @dev invest which borrows dai and invest to vault.
     * @param _amount  delgated amount to be borrowed.
     * @param _asset  asset to borrow.
     * @param _marginAmount  margin amount will be 10 % of _amount calculated on front end to avoid soldity decimal issue.
     * @param _interestAmount  aave dai interest amount to be calculated with aave's subgraph.
     * @param _duration  borrow duration.
     // Note the borrower needs to approve the margin pool to spend _interestAmount + _marginAmount
    */
    function invest(
        uint256 _amount,
        address _asset,
        uint256 _marginAmount,
        uint256 _interestAmount,
        uint256 _duration
    ) public {
        // get atoken address
        ( , address _debtToken, ) = dataProvider.getReserveTokensAddresses(
            _asset
        );
        // get the borrowing allowance
        uint256 _delegatedAmount = IStableDebtToken(_debtToken).borrowAllowance(
            creditPool,
            address(this)
        );
        require(
            _delegatedAmount >= totalBorrowedAmount,
            "MarginPool: insufficient debt allowance"
        );
        // compute the solvency ratio added this buffere 10^5 since solidity does not handle decimal places
        // so to render solvency ratio on ui we need to divide by 10^5 in the js code
        uint256 solvencyRatio = (_amount.mul(100000))
            .add(_marginAmount.add(_interestAmount))
            .div(_amount);
        require(
            solvencyRatio >= minSolvencyRatio.mul(100000),
            "MarginPool: insufficient margin amount"
        );
        // getting the actual timestamp for the duration
        uint256 duration = block.timestamp.add(_duration);
        // checking if the borrower already exists
        Borrower memory borrower = delegateeDeposits[msg.sender];
        require(
            !borrower.hasBorrowed,
            "MarginPool: borrower has borrowed previously"
        );

        // strong borrowe details in storage
        delegateeDeposits[msg.sender] = Borrower(
            duration,
            _marginAmount,
            _amount.add(_marginAmount.add(_interestAmount)),
            solvencyRatio,
            _interestAmount,
            true
        );
        IERC20(_asset).transferFrom(msg.sender, address(this), _marginAmount.add(_interestAmount));
        // setting total borrowed amount in storage
        totalBorrowedAmount += _amount;

        // getting the delgated credit amount from aave
        lendingPool.borrow(_asset, _amount, 1, 0, creditPool);
        // approve yearn vault to spend dai
        IERC20(_asset).approve(
            address(daiVault),
            _amount.add(_marginAmount.add(_interestAmount))
        );
        // investing to yearn vault
        YearnVault(daiVault).deposit(
            _amount.add(_marginAmount.add(_interestAmount))
        );
    }

    /**
     * @dev repay which withdraw invested dai from yearn vault and repay the delgated credit.
     * @param _asset  asset borrowed.
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     */
    function repay(address _asset, uint256 _ytokenBalance) public {
        Borrower storage borrower = delegateeDeposits[msg.sender];
        require(
            borrower.duration > block.timestamp,
            "MarginPool: borrow duration has exceeded you will be liquidated"
        );
        borrower.duration = 0;
        uint256 margin = borrower.margin;
        borrower.margin = 0;
        uint256 investment = borrower.investment;
        borrower.interestAmount = 0;
        borrower.investment = 0;
        borrower.solvencyRatio = 0;
        borrower.hasBorrowed = false;
        console.log(IERC20(_asset).balanceOf(address(this)), "dai balance before withdraw");

        (uint creditPoolReward, uint borrowerReward) = calculateRewardSplit(_asset, _ytokenBalance, investment);

        // withdrawing yield amount from yearn
        YearnVault(daiVault).withdraw(_ytokenBalance);
        console.log(IERC20(_asset).balanceOf(address(this)), "dai balance after withdraw");
        // get reward split
        totalBorrowedAmount -= investment.sub(margin);
        // repaying the borrowed credit with interest
        lendingPool.repay(_asset, investment.sub(margin), 1, creditPool);
        // repaying the applicable reward amount to credit pool
        IERC20(_asset).safeTransfer(creditPool, creditPoolReward);
        // repaying the applicable reward amount + margin to borrower
        IERC20(_asset).safeTransfer(msg.sender, margin.add(borrowerReward));
    }

    /**
     * @dev calculateRewardSplit computes borrower and credit pool rewards.
     * @param _asset  asset borrowed.
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     * @param _investedAmount  initial invested amount in yearn.
     */
    function calculateRewardSplit(address _asset, uint256 _ytokenBalance, uint256 _investedAmount) public returns (uint, uint) {
        uint256 totalReturn = getYearnBorrowerShare(_ytokenBalance);
        console.log("total returns principal + rewards", totalReturn);
        // get atoken address
        (, address _debtToken,) = dataProvider.getReserveTokensAddresses(
            _asset
        );
        // get the borrowing allowance
        uint256 _delegatedAmount = IStableDebtToken(_debtToken).borrowAllowance(
            creditPool,
            address(this)
        );
        // getting borrow rate
        uint256 borrowRate = interestRateStrategy.computeBorrowingRewardRate(
            totalBorrowedAmount,
            _delegatedAmount
        );
        pendingBorrowingRate = borrowRate;
        console.log("pending borrowing rate is", pendingBorrowingRate);

        //method below is preferred, else we get substraction overflow
        uint256 depositRate = interestRateStrategy.computeDepositRewardRate(
            totalBorrowedAmount,
            _delegatedAmount
        );

        pendingDepositRate = depositRate;
        console.log("pending borrowing rate is", pendingDepositRate);

        // getting the rewards earned = total returns - investedAmount
        // the tx reverts because due to some reason even after 1 day the totalReturn is 22.99 dai and _investedAmount was 23 dai
        uint256 reward = totalReturn.sub(_investedAmount);
        // calculating the reward amount only for both credit pool and borrower
        uint256 creditPoolReward = reward.mul(depositRate);
        uint256 borrowerReward = reward.mul(borrowRate);
        return (creditPoolReward, borrowerReward);
    }

    /**
     * @dev getYearnBorrowerShare which returns the total user returns
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     */
    function getYearnBorrowerShare(uint256 _ytokenBalance) public view returns(uint256) {
        uint balance = YearnVault(daiVault).balance();
        uint supply = YearnVault(daiVault).totalSupply();
        uint _userReturns = (balance.mul(_ytokenBalance)).div(supply);
        return _userReturns;
    }

    /**
     * @dev getYearnVaultLiquidityValue which returns the liquidity value of the amount in usd invested by the borrower
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     */
    function getYearnVaultLiquidityValue(uint256 _ytokenBalance)
        public view
        returns (uint256)
    {
        uint balance = YearnVault(daiVault).balance();
        uint supply = YearnVault(daiVault).totalSupply();
        uint _userReturns = (balance.mul(_ytokenBalance)).div(supply);
        // this is multiplied by 10 ^ 8 so needs to be divided by 10 ^ 8 and then converted to eth format on front end
        uint256 usdQuote = uint256(fiatDaiRef.latestAnswer());
        usdQuote = usdQuote.mul(_userReturns);
        return _userReturns;
    }

    function getTotalBorrowed() public view returns(uint256) {
      return totalBorrowedAmount;
    }

    function getPendingDepositRate() public view returns(uint256) {
      return pendingDepositRate;
    }

    function getPendingBorrowingRate() public view returns(uint256) {
      return pendingBorrowingRate;
    }
}
