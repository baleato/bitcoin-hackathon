# bitcoin-hackathon

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/baleato/bitcoin-hackathon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Project NoRiskWallet
====================

The problem
-----------

- As a user I want to buy a movie and start watching it immediately
- As a mechant I want to sell a movie and receive the payment instantly without trusting any third party or any risk of charge back or double spend


Current solutions
-----------------

- Bitcoin payments can not be trusted unteil they receive at least 1 confirmation in the blockchain (10 mins on average).
- Paypal and credit cards can always do charge back from the customer and revoke the payment, even weeks after the transaction took place.


NoRiskWallet solutions
----------------------

With NoRiskWallet you can fund a risk free wallet and all the money that you don't spend after a deadline you set some time in the future, will return to you.

Now merchants can establish zera trust relations with NoRiskWallet to accept 0 confirmation transactions

You can pay any merchant that has a NoRiskWallet instantly and with no risk.


Extras
------

- NoRiskWallet has to put a collateral with the merchants that is at least as big as the funding users have in their NoRiskWallet


Implementation details
----------------------

The system is based in Bitcoin multisignature addresses (2 of 2), used between customer and NoRiskWallet and between NoRiskWallet and merchant

Both users and merchants establish a payment channel with NoRiskWallet.
The user puts locks for sometime an amount is willing to partially spend.
The merchant agrees to have a payment channel with NoRiskWallet where NoRiskWallet locks some funds for a limited period of time.

After payment channels are opened and confirmed in the bictoin blockchain a user can create in collaboration with merchant and NoRiskWallet, two Bitcoin transactions that depend on each other and have to be signed in an specific order to:
1. pay the merchant without possibility of being double spend (with the merchant's signature)
2. return the collateral NoRiskWallet locked without possibility of loosing funds
3. customer having the final word in approving the whole chain of transactions


The transactions should follow a flow like the one described in the diagrams below:

![alt text](images/Account charging.png "Customer charging the NoRiskWallet")
![alt text](images/seller connection.png "Seller establishing payment channel with NoRiskWallet")
![alt text](images/buy process.png "Customer buying from Seller using NoRiskWallet")