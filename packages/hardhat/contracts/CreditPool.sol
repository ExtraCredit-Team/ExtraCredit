pragma solidity >=0.6.0 <0.7.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import { ILendingPool, IProtocolDataProvider, IStableDebtToken, AggregatorInterface } from "contracts/Interfaces.sol";

contract CreditPool {
  using SafeERC20 for IERC20;
  using SafeMath for uint256;
  //mapping(address => uint256) public depositBalances;

  struct Depositor {
	   uint256 delegatedAmount;
	   uint256 depositAmount;
  }

  mapping(address => Depositor) public depositors;
  mapping (address => uint256) public checkpoints;

  //mapping(address => mapping(uint256 => uint256)) public delegatedAmounts;
  //mapping(address => uint256) public delegatedAmounts;
  uint256 public totalDeposit;
  uint256 public totalDelegation;
  uint256 public ethRate;
  uint256 public daiRate;
  uint public reward;
  uint constant public REWARD_MULTIPLIER = 1/uint256(2);

  ILendingPool constant lendingPool = ILendingPool(address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9)); // on mainnet
  IProtocolDataProvider constant dataProvider = IProtocolDataProvider(address(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d)); //on mainnet
  AggregatorInterface constant fiatDaiRef = AggregatorInterface(address(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9)); // on mainnet
  AggregatorInterface constant fiatEthRef = AggregatorInterface(address(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)); // on mainnet
  address public dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

  event Deposited(uint256 amount, address aToken);
  event Withdrawn(uint256 amount, address aToken);

  /**
    * @param _debtToken The asset allowed to borrow
  */
  function deposit(uint256 _amount, address _aToken, address _delegatee, uint256 _delegatedAmount, address _debtToken) external {
    if(checkpoints[msg.sender] == 0) {
      checkpoints[msg.sender] = block.number;
    }
    Depositor storage depositor = depositors[msg.sender];
	  depositor.depositAmount += _amount;
	  depositor.delegatedAmount += _delegatedAmount;
	  //depositBalances[msg.sender] += _amount;
    totalDelegation += _delegatedAmount;
    totalDeposit += _amount;
    IERC20(_aToken).transferFrom(msg.sender, address(this), _amount);
    delegateCredit(_delegatee, _delegatedAmount, _debtToken);
    emit Deposited(_amount, _aToken);
  }
  /**
    * To allow a direct deposit of the collateral in Aave lending pool
  */
  function depositOnLendingPool(address _asset, address _depositOnBehalfOf, uint _amount) external {
    IERC20(_asset).safeApprove(address(lendingPool), _amount);
    _depositOnBehalfOf = msg.sender;
    lendingPool.deposit(_asset, _amount, _depositOnBehalfOf, 0);
  }
  /**
    * Approves the borrower to take an undercollateralized loan
    * @param _debtAsset The asset allowed to borrow
  */
  function delegateCredit(address _borrower, uint256 _amount, address _debtAsset) internal {
    (, address stableDebtTokenAddress,) = dataProvider.getReserveTokensAddresses(_debtAsset);
    IStableDebtToken(stableDebtTokenAddress).approveDelegation(_borrower, _amount);
  }


  function borrow(uint256 _amount, address _debtToken, uint256 _interestRateMode, uint16 _referralCode, address _onBehalfOf) external {
    lendingPool.borrow(_debtToken, _amount, _interestRateMode, _referralCode, _onBehalfOf);
  }


  function withdraw(uint256 _amount, address _aToken) external {
    require(depositors[msg.sender].depositAmount > _amount, "you didnt deposit enough");

    uint256 checkpoint = checkpoints[msg.sender];
    uint256 balance = IERC20(dai).balanceOf(address(this));
    uint256 ratio = depositors[msg.sender].delegatedAmount / totalDelegation;

    //applying a simple multiplier with 40320 ~ 7days
    if ( (block.number - checkpoint) < 40320) {
      reward = balance * ratio * REWARD_MULTIPLIER;
    } else {
      reward = balance * ratio;
    }

    depositors[msg.sender].depositAmount -= _amount;
    //below is TBD
    //depositors[msg.sender].delegatedAmount -= 0;
    totalDeposit -= _amount;
    checkpoints[msg.sender] = 0;
    IERC20(_aToken).safeTransfer(msg.sender, _amount);
    IERC20(dai).safeTransfer(msg.sender, reward);
    emit Withdrawn(_amount, _aToken);
  }

  function getDelegatedAmountPerUser(address _depositor) public view returns(uint256) {
	  Depositor memory depositor = depositors[_depositor];
    return depositor.delegatedAmount;
  }

  function getDepositPerUser(address _depositor) public view returns(uint256) {
	  Depositor memory depositor = depositors[_depositor];
    return depositor.depositAmount;
  }

  function getTotalDeposit() public view returns(uint256) {
    return totalDeposit;
  }

  function getTotalDelegation() public view returns(uint256) {
    return totalDelegation;
  }
  // the eth rate and dai rate will be multiplied by 10 ** 8 form that's done on chainlink side we need to handle it on front end
  function getETHRate() public view returns(uint256) {
    return uint256(fiatEthRef.latestAnswer());
  }

  function getDAIRate() public view returns(uint256) {
    return uint256(fiatDaiRef.latestAnswer());
  }
	/*
  function getUserInfo(address _user) external view returns(uint256 totalCollateral, ) {

  }
  */
}
