import { WebApp } from 'meteor/webapp';
import express from 'express';
const multer = require("multer");

var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

const app = express()
const port = 8080
require('dotenv').config();

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK("42aa119ea65b0c6d717d", "d6fd0364599981dc29c53586d07e57bcf8b726e1414b27020a0289387294677c");
const nftWorkspacePath = __dirname + '/workspace';
const algosdk = require('algosdk');
const crypto = require('crypto');
const bs58 = require("bs58");
const config = require("./config")
const algoAddress = config.algodClientUrl;
const algodClientPort = config.algodClientPort;
const algoToken = config.algodClientToken;


const algodClient = new algosdk.Algodv2(
  algoToken,
  algoAddress,
  algodClientPort
);

var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage })

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong! "+err);
};

app.post(
  "/asset_upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  async (req, res) => {
    console.log(req.file) 
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");
    // uploads/Screenshot 2022-01-14 at 06.05.40.png
    // relative to .meteor/local/build/programs/server

    if (path.extname(req.file.originalname).toLowerCase() === ".png" ||  path.extname(req.file.originalname).toLowerCase() === ".jpg" ||  path.extname(req.file.originalname).toLowerCase() === ".jpeg") {
     
      const asset = await pinata.testAuthentication().then((res) => {
        console.log('Algorand NFT::ARC3::IPFS scenario 1 test connection to Pinata: ', res);
        let nftFileName = 'asa_ipfs.png'
        const sampleNftFile = fs.createReadStream(req.file.path);
        const asset = scenario1(sampleNftFile, req.file.filename, 'NFT::ARC3::IPFS::1', 'This is a Scenario1 NFT created with metadata JSON in ARC3 compliance and using IPFS via Pinata API')
        console.log(asset)
        return asset;
      }).catch((err) => {
        return console.log(err);
      });
      
        res
          .status(200)
          .contentType("text/plain")
          .end(JSON.stringify(asset));
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png and .jpg files are allowed!");
      });
    }
  }
);


app.get('/createPVLimitContract', (req, response) => {
  console.log(req.url)
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  const code = require('./limitorder')();
  console.log(code);
  console.log(options)

  createPVLimitContract(options['account'], options['price'], options['assetID'])
    .then((data) => {
      response.write(JSON.stringify({
        "contractAddress": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.get('/executePVLimitContract', (req, response) => {
  console.log("executePVLimitContract")
  console.log(req.url)
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);
  console.log(options)

  const code = require('./limitorder')();
  //console.log(code);

  executePVLimitContract(options['address'], options['price'])
    .then((data) => {
      response.write(JSON.stringify({
        "txId": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.get('/createSplitContract', (req, response) => {
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  require('./split')();

  createSplitContract(options['sender'], options['recipient1'], options['ratio1'], 
    options['recipient2'], options['ratio2'])
    .then((data) => {
      response.write(JSON.stringify({
        "contractAddress": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.get('/executeSplitContract', (req, response) => {
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  require('./split')();

  executeSplitContract(options['address'], options['amount'])
    .then((data) => {
      response.write(JSON.stringify({
        "txId": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.listen(port, () => {
  console.log(`Peer2Panel API listening at http://localhost:${port}`)
})

WebApp.connectHandlers.use(app);

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}
const waitForConfirmation = async function (txId) {
  let response = await algodClient.status().do();
  let lastround = response["last-round"];
  while (true) {
    const pendingInfo = await algodClient
      .pendingTransactionInformation(txId)
      .do();
    if (
      pendingInfo["confirmed-round"] !== null &&
      pendingInfo["confirmed-round"] > 0
    ) {
      console.log(
        "Transaction " +
          txId +
          " confirmed in round " +
          pendingInfo["confirmed-round"]
      );
      break;
    }
    lastround++;
    await algodClient.statusAfterBlock(lastround).do();
  }
}


const createAccount = function () {
  try {
    const myaccount = algosdk.generateAccount();
    console.log("Account Address = " + myaccount.addr);
    let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
    console.log("Account Mnemonic = " + account_mnemonic);
    console.log("Account created. Save off Mnemonic and address");
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log("https://dispenser.testnet.aws.algodev.network/?account=" + myaccount.addr);

    return myaccount;
  }
  catch (err) {
    console.log("err", err);
  }
};

const convertIpfsCidV0ToByte32 = (cid) => {
  let hex = `${bs58.decode(cid).slice(2).toString('hex')}`
  let base64 = `${bs58.decode(cid).slice(2).toString('base64')}`
  console.log('CID Hash Converted to hex: ', hex)

  const buffer = Buffer.from(bs58.decode(cid).slice(2).toString('base64'), 'base64');
  console.log('CID Hash Converted to Base64: ', base64)
  const volBytes = buffer.length;
  console.log('CID Hash Bytes volume is: ', `${volBytes} bytes, OK for ASA MetaDataHash field!`)

  return { base64, hex, buffer };
};

const convertByte32ToIpfsCidV0 = (str) => {
  if (str.indexOf('0x') === 0) {
    str = str.slice(2);
  }
  return bs58.encode(bs58.Buffer.from(`1220${str}`, 'hex'));
};

const scenario1 = async (nftFile, nftFileName, assetName, assetDesc) => {
  let fileCat = 'image';

  let nftFileNameSplit = nftFileName.split('.')
  let fileExt = nftFileNameSplit[1];

  let kvProperties = {
    "url": nftFileNameSplit[0],
    "mimetype": `image/${fileExt}`,

  };
  let properties = {
    "file_url": nftFileNameSplit[0],
    "file_url_integrity": "",
    "file_url_mimetype": `image/${fileExt}`,

  };
  const pinataMetadata = {
    name: assetName,
    keyvalues: kvProperties
  };

  const pinataOptions = {
    cidVersion: 0,
  };

  const options = {
    pinataMetadata: pinataMetadata,
    pinataOptions: pinataOptions
  };

  const resultFile = await pinata.pinFileToIPFS(nftFile, options);
  console.log('Algorand NFT::ARC3::IPFS scenario 1: The NFT original digital asset pinned to IPFS via Pinata: ', resultFile);

  let metadata = config.arc3MetadataJSON;

  let integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash)
  metadata.properties = properties;
  metadata.properties.file_url = `https://ipfs.io/ipfs/${resultFile.IpfsHash}`;
  metadata.properties.file_url_integrity = `sha256-${integrity.base64}`;
  metadata.name = `${assetName}@arc3`;
  metadata.description = assetDesc;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `sha256-${integrity.base64}`;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;
  metadata.external_url = "https://demo.peer2panel.com/";

  console.log('Algorand NFT::ARC3::IPFS scenario 1: The NFT prepared metadata: ', metadata);

  const resultMeta = await pinata.pinJSONToIPFS(metadata, options);
  let jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash)
  console.log('Algorand NFT::ARC3::IPFS scenario 1: The NFT metadata JSON file pinned to IPFS via Pinata: ', resultMeta);
  return {
    name: `${assetName}@arc3`,
    url: `ipfs://${resultMeta.IpfsHash}`,
    metadata: jsonIntegrity.buffer,
    integrity: jsonIntegrity.base64,
  }

};

async function createAsset(asset, account) {
  console.log("");
  console.log("==> CREATE NFT");
  const accountInfo = await algodClient.accountInformation(account.addr).do();
  const startingAmount = accountInfo.amount;
  console.log("Created account balance: %d microAlgos", startingAmount);

  const params = await algodClient.getTransactionParams().do();

  const defaultFrozen = false;
  const unitName = 'nft';
  const assetName = asset.name;
  const url = asset.url;

  const managerAddr = account.addr;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
  const decimals = 0;
  const total = 1;
  const metadata = asset.metadata;
  const metadataUint8Array = new Uint8Array(metadata);
  const length = metadataUint8Array.length;
  const integrity = asset.integrity;
  console.log('ASA MetaDataHash: ', metadataUint8Array)
  console.log('ASA MetaDataHash Length: ', length)
  console.log("nft_integrity : " + integrity);

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: account.addr,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    assetMetadataHash: metadataUint8Array,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });

  const rawSignedTxn = txn.signTxn(account.sk);
  const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
  let assetID = null;
  const confirmedTxn = await waitForConfirmation(tx.txId);

  
  const ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx["asset-index"];

  console.log('Account: ',account.addr,' Has created ASA with ID: ', assetID);


  return { assetID };

}

async function createNFT() {
  try {
    let account = createAccount();
    console.log("Press any key when the account is funded...");
    await keypress();

    const { assetID } = await createAsset(asset, account);
    console.log("Congratulations! You created your IPFS supporting, ARC3 complying NFT on Algorand! Check it by link below:");
    console.log(`https://testnet.algoexplorer.io/asset/${assetID}`);


  }
  catch (err) {
    console.log("err", err);
  }
  process.exit();
};

