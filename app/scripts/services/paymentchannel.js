angular.module('scratchApp')
    .factory('PaymentChannel', [ function() {

        /*
            BitcoinJS is availabel through the 'Bitcoin' public variable
         */

        return {

            // Export necessary functions here
            
            /** Create Multisignature transaction using public keys of two parties
             * public_key_1: bitcoin.ECPubKey (example Bitcoin.ECKey.makeRandom().pub)
             * public_key_2: bitcoin.ECPubKey
             */
            create_multisignature_address : function(public_key_1, public_key_2) {
                var pubKeys = [ public_key_1, public_key_2 ];
                var redeemScript = Bitcoin.scripts.multisigOutput(2, pubKeys); // 2 of 2
                return redeemScript;
            },
            
            /** Calculate Multisignature public address from redeem script
             * redeemScript : multisigOutput
             */
            get_multisig_address_from_redeem_script : function(redeemScript) {
                var scriptPubKey = Bitcoin.scripts.scriptHashOutput(redeemScript.getHash());
                var multisig_address = Bitcoin.Address.fromOutputScript(scriptPubKey).toString();
                return multisig_address;
            },
            
            /** Create funding transaction
             * private_key_1: private key (of person funding transaction, A) in format returned by Bitcoin.ECKey.makeRandom()
             * input_transaction_id: id of the input Bitcoin transaction (example Bitcoin.ECKey.makeRandom().pub)
             * redeemScript: multisigOutput (this uniquely generates the multisig address)
             * satoshis: amount of Satoshis to send (example 1000000)
             */
            create_and_sign_funding_transaction : function(private_key_1, input_transaction_id, redeemScript, satoshis) {
                var multisig_address = this.get_multisig_address_from_redeem_script(redeemScript);
                var fund_tx_builder = new Bitcoin.TransactionBuilder();
                // Add the input with *hash* form previous transaction hash
                // and index of the output to use (this is an existing transaction in the blockchain)
                fund_tx_builder.addInput(input_transaction_id, 0);
                //fund_tx_builder.addOutput("1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 15000); // Output address plus amount in satoshis
                fund_tx_builder.addOutput(multisig_address, satoshis); // Output address plus amount in satoshis
                // Sing and broadcast only after refund has been signed by both
                fund_tx_builder.sign(0, private_key_1); // Sign transaction
                var fund_tx = fund_tx_builder.build();
                return fund_tx; // Refund transaction will depend on input_transaction_id = fund_tx.getId();
            },
            
            /** Create return transaction from multisig_address to a (public key from user person funding transaction, A)
             * private_key_1: private key (of person funding transaction, A) in format returned by Bitcoin.ECKey.makeRandom()
             * input_transaction_id : id of the funding transaction (from create_funding_transaction)
             * lock_time : this should be a unix timestamp or a block newer/higher than 340297 (current block)
             * redeemScript: multisigOutput (this uniquely generates the multisig address)
             * satoshis: amount of Satoshis to send (example 1000000)
             */
            create_and_sign_refund_transaction : function(private_key_1, input_transaction_id, lock_time, redeemScript, satoshis) {
                var tx_builder = new Bitcoin.TransactionBuilder();
                // Add the input with *hash* form previous transaction hash and index of the output to use
                tx_builder.addInput( input_transaction_id, 0);
                //tx_builder.addOutput("1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 15000); // Output address plus amount in satoshis
                tx_builder.addOutput(private_key_1.pub.getAddress().toString(), 10000); // Output address plus amount in satoshis
                // Make transaction only spendable/minable in the future
                tx_builder.tx.locktime = lock_time // Some block in the furute (currently network is after block 340297)
                tx_builder.tx.ins[0].sequence = 1 // Transaction will be final regardless of locktime if 4294967295
                tx_builder.sign(0, private_key_1, redeemScript); // Sign transaction
                var tx = tx_builder.buildIncomplete();
                
                return tx.toHex();
            }
        };
    }]);