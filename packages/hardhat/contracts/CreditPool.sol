pragma solidity >=0.6.0 <0.7.0;
import 'hardhat/console.sol';
import { IERC20, ILendingPool, IProtocolDataProvider, IStableDebtToken } from "contracts/Interfaces.sol";
import { SafeERC20} from "contracts/Libraries.sol";


contract CreditPool {
  using SafeERC20 for IERC20;
  //mapping(address => uint256) public depositBalances;

  struct Depositor {
	   uint256 delegatedAmount;
	   uint256 depositAmount;
  }

  mapping(address => Depositor) public depositors;

  //mapping(address => mapping(uint256 => uint256)) public delegatedAmounts;
  //mapping(address => uint256) public delegatedAmounts;
  uint256 public totalDeposit;
  uint256 public totalDelegation;

  ILendingPool constant lendingPool = ILendingPool(address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9)); // on mainnet
  IProtocolDataProvider constant dataProvider = IProtocolDataProvider(address(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d)); //on mainnet
  event Deposited(uint256 amount, address aToken);
  event Withdrawn(uint256 amount, address aToken);
  /**
    * @param _debtToken The asset allowed to borrow
  */
  function deposit(uint256 _amount, address _aToken, address _delegatee, uint256 _delegatedAmount, address _debtToken) external {
    Depositor storage depositor = depositors[msg.sender];
	  depositor.depositAmount += _amount;
	  depositor.delegatedAmount += _delegatedAmount;
	  //depositBalances[msg.sender] += _amount;
    totalDelegation += _delegatedAmount;
    totalDeposit += _amount;
    IERC20(_aToken).safeTransferFrom(msg.sender, address(this), _amount);
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
    depositors[msg.sender].depositAmount -= _amount;
    //below is TBD
    //depositors[msg.sender].delegatedAmount -= 0;
    totalDeposit -= _amount;
    IERC20(_aToken).transfer(msg.sender, _amount);
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
	/*
  function getUserInfo(address _user) external view returns(uint256 totalCollateral, ) {

  }
  */
}
