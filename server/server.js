var express = require('express');
var bitcoin = require('bitcoinjs-lib');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var Datastore = require('nedb');

var db = new Datastore({ autoload : true });

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// I'm alive!
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// User requests a public key, required to create: 2of2Address, paymentTransaction, refundTransaction
// Creating these on the server is not possible (too bad :( ), so there is some effort required from the user.
// Food of thought: how to minimize the impact on the user? tools? wallet implementations?
// Input:   	{ userPublicKey : hex }
// Output: 		{ ServerPublicKey : hex }
app.post('/wallet/create', function (req, res) {
    var userPubKeyHex = req.body.userPublicKey;
    console.log("Creating key for the user: " + userPubKeyHex);

    var userPubKey = bitcoin.ECPubKey.fromHex(userPubKeyHex);
	
	var serverPrivKey = bitcoin.ECKey.makeRandom();
	
	var entity = { _id : userPubKey.toHex(), UserPublicKey : userPubKey.toHex(), ServerPrivateKey : serverPrivKey.toWIF(), ServerPublicKey : serverPrivKey.pub.toHex() };
	
	db.insert(entity, function (err, newDoc) { 
		if (err) {
			console.log(err);
		} else {
			console.log("Stored entity: " + entity._id);
		}
	});
	
	res.send({ "ServerPublicKey" : serverPrivKey.pub.toHex() })
});

// Check if the refundTransaction is valid
// Return true if valid, false otherwise
function verifyRefundTransaction(tx)
{
	// check if transaction output is from the first public key
	// .... if we care?
	
	// check if transaction is really about refunding the bitcoins back after a given time to the original address
	// .... do we even care to what address it's being refunded?
	
	// .... more?
	
	return true;
}

// 
// { walletOutputScript : hex, rawRefundTransactionHex, userPublicKey : hex, redeemScript : hex } : 
// { signedRefundTransaction : hex }
app.post('/transaction/signrefund', function (req, res) {
	// convert the input to internal objects
	var walletAddress = bitcoin.Address.fromOutputScript(req.body.walletOutputScript);
	
	// half signed refundTransaction
	var refundTransaction = bitcoin.Transaction.fromHex(req.body.rawRefundTransactionHex);
	var tx = bitcoin.TransactionBuilder.fromTransaction(refundTransaction)
	
	// public key of the user
	var userPubKey = bitcoin.ECPubKey.fromHex(req.body.userPublicKey);
	
	// get our private key from the database
	var entity;
	
	db.find(userPubKey.toHex(), function (err, doc) { 
		if (err) {
			console.log(err);
		} else {
			entity = doc;
		}
	});
	
	// Calculate redeemscript to sign the transaction
	var pubKeys = [ userPubKey, entity.ServerPublicKey ];
	var redeemScript = bitcoin.scripts.multisigOutput(2, pubKeys);
	
	// Not playing fair probably... one of the two public keys do not match
	if(redeemScript.toHex() != req.body.redeemScript)
	{
		throw "Calculated redeemscript is not equal to received redeemscript"
	}
	
	var privateKey = bitcoin.ECKey.fromWIF(entity.ServerPrivateKey);
	
	if(!verifyRefundTransaction(tx))
	{
		throw "Refund transaction is not valid.";
	}
	
	// use the private key to sign the transaction
	tx.sign(0, privateKey, redeemScript);
	var retTx = tx.build();
	
	// return the signed transaction
	res.send({ "signedRefundTransaction" : retTx.toHex() });
	
	// probably best to store this refundTransaction so the user can download it at a later date
	// as most people lose all their stuff, shit happens...
	
	// do the communication with party C
	// request public key from the seller
	// create the same stuff as the user did for "us" (the server).
	// meaning: walletOutputScript, rawRefundTransactionHex, pubKey, redeemScript
});

// return all database values, test all the things!
app.get('/db/', function (req, res) {
	db.find({}, function (err, docs) {
	  if (err) { throw err; }
	  
	  res.send((docs));
	});
});

// Start server on localhost:3000
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)
})