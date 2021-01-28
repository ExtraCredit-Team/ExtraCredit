pragma solidity >=0.6.0 <0.7.0;

import "./WadRayMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { SafeMath} from "contracts/Libraries.sol";

contract InterestRateStrategy is Ownable {
using SafeMath for uint256;
using WadRayMath for uint256;

uint256 public optimalUtilization;
uint256 public excessRate;
uint256 public baseStableRate;
uint256 public slope1StableRate;
uint256 public slope2StableRate;

constructor(uint256 _optimalUtilization, uint256 _baseStableRate,
  uint256 _slope1StableRate, uint256 _slope2StableRate) public
{
	setPoolVariables(_optimalUtilization, _baseStableRate, _slope1StableRate, _slope2StableRate);
}


function setPoolVariables(uint256 _optimalUtilization, uint256 _baseStableRate,
  uint256 _slope1StableRate, uint256 _slope2StableRate) public
{
	optimalUtilization = _optimalUtilization;
  excessRate = WadRayMath.ray().sub(optimalUtilization);
	baseStableRate = _baseStableRate;
	slope1StableRate = _slope1StableRate;
	slope2StableRate = _slope2StableRate;
}

/**
  * Computes utilisation ratio between the total of borrowed amounts and the total amount of credit line delegated by the depositors
  * @param _totalBorrowed The total amount borrowed in the MarginPool
  * @param _totalCreditAvailable The total amount of credit delegated in the CreditPool
*/
function getUtilisation(uint256 _totalBorrowed, uint256 _totalCreditAvailable) public view returns(uint256) {
	return _totalBorrowed.wadToRay()
    .rayDiv(_totalCreditAvailable.wadToRay())
    .rayToWad();
}

/**
  * Computes the rate the depositors would receive from the total share of rewards earned by the investment pools
  * @param _totalBorrowed The total amount borrowed in the MarginPool
  * @param _totalCreditAvailable The total amount of credit delegated in the CreditPool
*/
function computeBorrowingRewardRate(uint256 _totalBorrowed, uint256 _totalCreditAvailable) public view returns(uint256) {
  return WadRayMath.ray().sub(computeDepositRewardRate(_totalBorrowed, _totalCreditAvailable));
}

/**
  * Computes the rate the CreditPool would receive from the total share of rewards earned by the investment pools
  * @param _totalBorrowed The total amount borrowed in the MarginPool
  * @param _totalCreditAvailable The total amount of credit delegated in the CreditPool
*/
function computeDepositRewardRate(uint256 _totalBorrowed, uint256 _totalCreditAvailable) public view returns(uint256) {
  if(_totalBorrowed.rayDiv(_totalCreditAvailable.wadToRay()) < optimalUtilization)
		return baseStableRate.add(
      slope1StableRate.rayMul(
      getUtilisation(_totalBorrowed, _totalCreditAvailable).rayDiv(
      optimalUtilization
      )));
  else {
    uint256 ratio =
      getUtilisation(_totalBorrowed,_totalCreditAvailable).sub(optimalUtilization).rayDiv(excessRate);

      return baseStableRate.add(
        slope1StableRate).add(ratio.rayMul(slope2StableRate));
  }
}

}
