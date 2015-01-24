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

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// { userPublicKey : hex } : { ServerPublicKey : hex }
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

// { walletOutputScript : hex, rawRefundTransactionHex, userPublicKey : hex } : { signedRefundTransaction : hex }
app.post('/transaction/signrefund', function (req, res) {
	var walletAddress = bitcoin.Address.fromOutputScript(req.body.walletOutputScript);
	var refundTransaction = bitcoin.Transaction.fromHex(req.body.rawRefundTransactionHex);
	var tx = bitcoin.TransactionBuilder.fromTransaction(refundTransaction)
	
	var userPubKey = bitcoin.ECPubKey.fromHex(req.body.userPublicKey).toHex();
	
	// get our private key from the database
	var entity;
	
	db.find(userPubKey, function (err, doc) { 
		if (err) {
			console.log(err);
		} else {
			entity = doc;
		}
	});
	
	var privateKey = bitcoin.ECKey.fromWIF(entity.ServerPrivateKey);
	
	// use the private key to sign the transaction
	tx.sign(0, privateKey);
	var retTx = tx.build();
	
	// return the signed transaction
	res.send({ "signedRefundTransaction" : retTx.toHex() });
	
	// do the communication with party C
});

app.get('/db/', function (req, res) {
	db.find({}, function (err, docs) {   // Callback is optional
	  //if (err) throw err;
	  
	  res.send((docs));
	});
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)
})