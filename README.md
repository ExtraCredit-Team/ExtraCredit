## Overall

ExtraCredit is a product connecting credit line lenders with borrowers. The current application of the solution is margin lending which, in traditional finance, enables borrowers to take loans and invest the money into investment vehicles. ExtraCredit uses Aave Credit Delegation under the hood.


## Problem

The DeFi market is currently plagued by a few challenges that existing and new participants currently face. There is no solution to take largely undercollateralized loans for the purpose of investing. Gas fees are high and discourage participants with smaller holdings to get involve with the current farming opportunities. The current yield driven market is also much more advantageous to existing “whales” and accentuate the wealth disparities within DeFi.


## Opportunities

Yield farming opportunities are all over the place. When demand for yield falls, it will become even more urgent for users to sustain their returns therefore we believe that benefiting from larger invested amounts will be key for some. Yield farmers have different profiles, on one side we often find less active users who are familiar with protocols such as Aave but lack the time or energy to keep updated of the latest yield strategy trends. This type of users usually leave their funds sitting on Aave, earning the current deposit rate of the platform. On the other side, more and more users spend increasing amount of time actively managing the portion of their portfolio dedicated to “farming”.


## Solution

ExtraCredit connects these different profiles. On one hand, it helps Aave depositors leverage off the current safety level of Aave by using their integrated feature of credit delegation and boosting the yield they get from their aTokens. On the other hand, it enables active farmers getting access to the farming power of a large DeFi portfolio. These active users will be dynamically monitoring their margin accounts, ensuring the most optimal yield returns for them. Running interest on the loan has to be paid in advance and is integrated into the repayment. An extra margin amount is also used to cover for potential impermanent loss.


## Vision

The vision of the project long term revolves around solving 2 main concerns:

- [x] Ensuring the safety of Aave depositors who delegate their credit lines to the protocol

- [x] Offering a suite a vaults that will keep up to date with the current market trends while ensuring that the underlying integrated protocols are considered safe enough to be whitelisted by ExtraCredit

The first point will benefit from integrating Aave Credit Delegation. Aave currently has billions of $ in its protocol and we believe that their efforts around ensuring the safety of its users funds will be key to ensuring proper liquidity to our platform. The user experience on the depositor side will also need to be very seamless and, just with a click of one or two buttons, Aave depositors should be able to boost their yield by a few percents.

The second point is suited to the most active users that constantly rebalance their portfolios. We believe that the long term implementation will lead to a vault aggregator type of interface suggesting different routes the farmer can choose from in order to optimize her strategies.


## Quickstart

```bash

git clone https://github.com/ExtraCredit-Team/ExtraCredit.git

```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```
