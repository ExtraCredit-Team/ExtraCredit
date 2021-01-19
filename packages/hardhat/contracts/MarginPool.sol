pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


interface AaveProtocolDataProvider {
    function getReserveTokensAddresses(address asset) view external returns(address);
}

interface DebtTokens {
    function borrowAllowance(address fromUser, address toUser) view external returns(uint256);
}

interface LendingPool {
    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external;

    function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external;
}

interface YearnVault {
    // deposit for stable coins
    function deposit(uint256 _amount) external;

    function depositETH() external payable;

    function withdrawETH(uint256 _shares) external payable;

    function withdraw(uint256 _shares) external;

    function balanceOf(address account) external view returns (uint256);

    function balance() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function controller() external view returns (address);

    function token() external view returns (address);

    function getPricePerFullShare() external view returns (uint256);
}

contract MarginPool {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    address public creditPool;
    address public lendingPool;
    mapping(address => uint256) public delegateeDeposits;

    constructor(address _creditPool, address _lendingPool) public {
        creditPool = _creditPool;
        lendingPool = _lendingPool;
    }

    function invest(uint256 _amount, address _asset, address _vault) public {
      if (IERC20(_asset).balanceOf(address(this)) > 0) {
          require(IERC20(_asset).balanceOf(address(this)) >  _amount, "MarginPool: insufficient debt balance");
      } else {
          uint256 _delegatedAmount = DebtTokens(_asset).borrowAllowance(creditPool, address(this));
          require(_delegatedAmount > _amount, "MarginPool: insufficient debt allowance");
      }
          delegateeDeposits[msg.sender] = _amount;
          LendingPool(lendingPool).borrow(_asset, _amount, 1, 0, creditPool);
          YearnVault(_vault).deposit(_amount);
    }

    function repay(uint256 _amount, address _asset, address _vault) public {
        require(_amount > 0, "MarginPool: repay amount is 0");
        YearnVault(_vault).withdraw(_amount);
        LendingPool(lendingPool).repay(_asset, _amount, 1, creditPool);
    }


}