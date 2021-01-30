module.exports = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_optimalUtilization",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_baseStableRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_slope1StableRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_slope2StableRate",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "baseStableRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalBorrowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalCreditAvailable",
        "type": "uint256"
      }
    ],
    "name": "computeBorrowingRewardRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalBorrowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalCreditAvailable",
        "type": "uint256"
      }
    ],
    "name": "computeDepositRewardRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "excessRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalBorrowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalCreditAvailable",
        "type": "uint256"
      }
    ],
    "name": "getUtilisation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "optimalUtilization",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_optimalUtilization",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_baseStableRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_slope1StableRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_slope2StableRate",
        "type": "uint256"
      }
    ],
    "name": "setPoolVariables",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "slope1StableRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "slope2StableRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];