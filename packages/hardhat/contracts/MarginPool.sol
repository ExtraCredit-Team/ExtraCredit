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
        totalBorrowedAmount -= investment.sub(margin);
        // withdrawing yield amount from yearn
        YearnVault(daiVault).withdraw(_ytokenBalance);
        // get reward split
        (uint creditPoolReward, uint borrowerReward) = calculateRewardSplit(_asset, _ytokenBalance, investment);
        // repaying credit  pool the borrowed funds
        lendingPool.repay(_asset, creditPoolReward.sub(margin), 1, creditPool);
        IERC20(_asset).safeTransfer(msg.sender, margin.add(borrowerReward));
    }

    /**
     * @dev calculateRewardSplit computes borrower and credit pool rewards.
     * @param _asset  asset borrowed.
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     * @param _investedAmount  initial invested amount in yearn.
     */
    function calculateRewardSplit(address _asset, uint256 _ytokenBalance, uint256 _investedAmount) public returns (uint, uint) {
        uint256 reward = getYearnVaultLiquidityValue(_ytokenBalance);

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
        uint256 creditPoolReward = reward.mul(uint256(1).sub(borrowRate));
        uint256 borrowerReward = reward.sub(_investedAmount).mul(borrowRate);
        return (creditPoolReward, borrowerReward);
    }

    /**
     * @dev getYearnVaultLiquidityValue which returns the invested liquidity
     * @param _ytokenBalance  calculated with borrower invested amount and duration they choose to boorow and taking in consideration the 1 year apy fetched from the api.
     */
    function getYearnVaultLiquidityValue(uint256 _ytokenBalance)
        public
        returns (uint256)
    {
        address controller = YearnVault(daiVault).controller();
        address token = YearnVault(daiVault).token();
        uint256 _userReturns = (
            YearnVault(daiVault).balance().mul(_ytokenBalance)
        )
            .div(YearnVault(daiVault).totalSupply());

        // Check balance
        uint256 vaultBalance = IERC20(token).balanceOf(address(this));
        if (vaultBalance < _userReturns) {
            uint256 _withdraw = _userReturns.sub(vaultBalance);
            YearnController(controller).withdraw(address(token), _withdraw);
            uint256 _after = IERC20(token).balanceOf(address(this));
            uint256 _diff = _after.sub(vaultBalance);
            if (_diff < _withdraw) {
                _userReturns = _userReturns.add(_diff);
            }
        }
        uint256 usdQuote = uint256(fiatDaiRef.latestAnswer());
        usdQuote = usdQuote.mul(_userReturns);
        return usdQuote;
    }

    function getTotalBorrowed() public view returns(uint256) {
      return totalBorrowedAmount;
    }
}
