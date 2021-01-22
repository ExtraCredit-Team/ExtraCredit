pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import { IERC20, ILendingPool, IProtocolDataProvider, IStableDebtToken } from "contracts/Interfaces.sol";
import { SafeERC20} from "contracts/Libraries.sol";

contract CreditPool {
  using SafeERC20 for IERC20;

  mapping(address => uint256) public depositBalances;
  uint256 public totalDeposit;

  ILendingPool constant lendingPool = ILendingPool(address(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9)); // on mainnet
  IProtocolDataProvider constant dataProvider = IProtocolDataProvider(address(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d)); //on mainnet

  event Deposited(uint256 amount, address aToken);

  /**
    * @param _debtToken The asset allowed to borrow
  */
  function deposit(uint256 _amount, address _aToken, address _delegatee, uint256 _delegatedAmount, address _debtToken) external payable {
    depositBalances[msg.sender] += _amount;
    totalDeposit += _amount;
    IERC20(_aToken).safeTransferFrom(msg.sender, address(this), _amount);
    delegateCredit(_delegatee, _delegatedAmount, _debtToken);
    emit Deposited(_amount, _aToken);
  }

  function depositOnLendingPool(address _asset, address _depositOnBehalfOf, uint _amount) external payable {
    IERC20(_asset).safeApprove(address(lendingPool), _amount);
    lendingPool.deposit(_asset, _amount, msg.sender, 0);
  }
  /**
    * Approves the borrower to take an undercollateralized loan
    * @param _debtAsset The asset allowed to borrow
  */
  function delegateCredit(address _borrower, uint256 _amount, address _debtAsset) internal {
    (, address stableDebtTokenAddress,) = dataProvider.getReserveTokensAddresses(_debtAsset);
    IStableDebtToken(stableDebtTokenAddress).approveDelegation(_borrower, _amount);
  }

  function borrow(uint256 _amount, address _debtToken, uint256 _interestRateMode, uint16 _referralCode, address _onBehalfOf) external payable {
    lendingPool.borrow(_debtToken, _amount, _interestRateMode, _referralCode, _onBehalfOf);
  }

  function withdraw(uint256 _amount, address _aToken) external {
    require(depositBalances[msg.sender] > _amount, "you didnt deposit enough");
    depositBalances[msg.sender] -= _amount;
    totalDeposit -= _amount;
    IERC20(_aToken).transfer(msg.sender, _amount);
  }
}
