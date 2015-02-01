
Transactions technical documentation
====================================

Knowledge references
--------------------

- **Micropayment channels**: https://bitcoin.org/en/developer-guide#micropayment-channel and https://bitcoinj.github.io/working-with-micropayments
- **Locktime** and sequence numbers: https://bitcoin.org/en/developer-guide#locktime-and-sequence-number


Transactions overview
---------------------
Payment diagram overview:
![alt text](images/diagrams/transactions.jpg "Payment diagram")

Terminology
- **A**: Customer, **B**: NoRiskWallet and **C**: Merchant
- **M1**: Is a multi-signature bitcoin address that requires 2 of 2 signatures to move funds, with signatures from Customer(A) and NoRiskWallet(B)
- **M2**: Is a multi-signature bitcoin address that requires 2 of 2 signatures to move funds, with signatures from NoRiskWallet(B) and Merchant(C)

To perform a payment this is the exact order in which the transactions need to be signed:

1. **Merchant(C)** signs transactions **Y** and **Z** from M2
2. **NoRiskWallet(B)** signs transaction **Y** from M2 and **X** from M1
3. **Customer(A)** signs transaction **X** from M1
4. **NoRiskWallet(B)** signs transaction **Z** from M2

Notes:

- After point 3 is completed, the payment is ready but not yet confirmed in the Bitcoin blockchain, A could still double spent transaction X with the help of B and make transaction Y invalid. Step 4 is the insurance for C
- Transaction Z depends on inputs from M
- Transaction Y depends on inputs from M and X
- Transaction X depends on inputs from N
- Transaction K depends on inputs from M
- Transaction J depends on inputs from N


Transactions in detail
----------------------

The transactions are divided in three flows, the first two payment channels established with NoRiskWallet some time before the actual payment needs to be executed. The a third flow for the actual instantaneous payment from customer to merchant

Establishing first payment channel between customer and NoRiskWallet
--------------------------------------------------------------------

The sequence below explains how to configure a payment channel. There is nothing different in this configuration from standard payment channels in previous documentation.

This payment channel should be created and confirmed in the Bitcoin blockchain at least two hours before the payment.

Transactions sequence:

1. **A** creates a public key _APubK1_.
2. **A** requests a public key from **B** _BPubK1_ and creates a multi-signature address **M1** using _APubK1_ and _BPubK1_ that requires 2 of 2 signatures to move funds.
3. **A** creates and signs a funding transaction (**N**) that sends 1 BTC to M1. But this transaction is **not yet released**.
4. **A** creates a refund transaction (**J**) that uses as input the output of transaction **N** and sends 1 BTC from **M1** to _APubK1_. This transaction has a time-lock set to 4 weeks in the future and 0 as the sequence number of the input.
5. **A** sends transaction **J** to **B** who signs and returns signed copy of **J** to **A**
6. **A** now has a valid refund transaction (**J**) and publishes funding transaction **N**. Once this transaction is confirmed in a Bitcoin block, the payment channel between **A** and **B** is open.

Establishing second payment channel between NoRiskWallet and merchant
---------------------------------------------------------------------

The sequence below explains how to configure a payment channel. There is nothing different in this configuration from standard payment channels in previous documentation.

This payment channel should be created and confirmed in the Bitcoin blockchain at least two hours before the payment.

The purpose of this payment channel is mainly to lock the funds that the third party **B** (NoRiskWallet) will use as a collateral when mediating in a transaction between customer **A** and merchant **C**.
The amount of collateral funds have to be at least as big as the funds that the customer **A** wants to spend on the merchant **C**.

**Note**: This sequence is exactly the same as the first payment channel, only the actors and their roles in the transaction are changed.

Transactions sequence:

1. **B** creates a public key _BPubK2_.
2. **B** requests a public key from **C** _CPubK1_ and creates a multi-signature address **M2** using _BPubK2_ and _CPubK1_ that requires 2 of 2 signatures to move funds.
3. **B** creates and signs a funding transaction (**M**) that sends 1 BTC to M2. But this transaction is **not yet released**.
4. **B** creates a refund transaction (**K**) that uses as input the output of transaction **M** and sends 1 BTC from **M2** to _BPubK1_. This transaction has a time-lock set to 4 weeks in the future and 0 as the sequence number of the input.
5. **B** sends transaction **K** to **C** who signs and returns signed copy of **J** to **B**
6. **B** now has a valid refund transaction (**K**) and publishes funding transaction **M**. Once this transaction is confirmed in a Bitcoin block, the payment channel between **B** and **C** is open.

Payment transaction
-------------------

The sequence below explains how a chain of transactions ensures the merchant will receive the funds from the customer or, in the worst case, from the NoRiskWallet funds.

1. **A** requests a public key from **C** _CPubK2_ as the invoice Bitcoin address where **A** has to deposit the funds in order to pay for the product **C** is selling.
2. **A** contacts **B** with the request to pay **C** _CPubK2_ an amount of 0.5 BTC
3. **B** creates and signs a transaction (**X**) with two outputs, one that sends 0.5 BTC from **M1** to **M2** (for the payment) and one that sends 0.5 BTC from **M1** to _APubK1_ (return unused money) with no time-lock and a final sequence.
4. **B** creates and signs a transaction (**Y**) with two outputs, one that sends 1 BTC from **M2** to _BPubK1_ (returning original collateral to **B**) and one that sends 0.5 BTC from **M2** to _CPubK2_ (the payment) with no time-lock and a final sequence.
5. **B** sends transaction **Y** to **C** for signing and **C** returns the signed transaction **Y** to **B** because it approves being paid.
6. **B** sends transaction **X** to **A** for signing together with signed and valid transaction **Y** so **A** has prove that is paying the correct merchant. Then **A** returns the signed transaction **X** to **B** because it approves the payment to **C**.
7. **B** has fully signed chain of transactions **X** and **Y** (one depending on the other) but before sending to **C**, **C** still needs an insurance transaction from **B**
8. **B** creates and signs a transaction (**Z**) with two outputs, one that sends 0.5 BTC from **M2** to _CPubK2_ (the payment collateral) and one that sends 0.5 BTC from **M2** to _BPubK1_ (return unused money from **B**).  This transaction has a time-lock set to 2 weeks in the future (smaller than original refund transaction **K**) and 0 as the sequence number of the input. This transaction will be invalid in case the chain of transactions **X** and **Y** gets confirmed in the blockchain, otherwise, this transaction is the insurance **C** has to receive the funds promised by **A**.
9. **B** sends all signed transactions to **C** and both of them can publish transactions **X** and **Y** to the bitcoin network and **C** can already deliver the product to **A** without needing to wait for a confirmation in the blockchain.

Attacks
-------

Since all funds moved in these transactions are locked in multi-signature addresses **M1** and **M2**, all attack scenarios depend on two of the three actors (A, B and C) working together against a single actor.

Technology precursors
---------------------

- Reddit comments from user https://www.reddit.com/user/oakpacific
- Impulse from BitPay
- Vague explanations about payment hubs from Peter Todd


Known limitations
-----------------

- Transaction malleability can change transaction IDs making the chain of transactions discussed in this document unusable. The solution is to use the proposed BIP-65 OP_CHECKLOCKTIMEVERIFY https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki