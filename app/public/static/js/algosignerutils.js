function checkForAlgosigner() {
  if (typeof AlgoSigner !== 'undefined') {
    console.log(`AlgoSigner check passed.`);
    document.getElementById('divAlgoSignerCheck').classList.add("is-hidden");
  } else {
    console.log(`Couldn't find AlgoSigner!`);
    document.getElementById('divAlgoSignerCheck').classList.remove("is-hidden");
  };
}

async function waitForAlgosignerConfirmation(tx) {
  console.log(`Transaction ${tx.txId} waiting for confirmation...`);
  let status = await AlgoSigner.algod({
    ledger: 'TestNet',
    path: '/v2/transactions/pending/' + tx.txId
  });

  while(true) {
    if(status['confirmed-round'] !== null && status['confirmed-round'] > 0) {
      //Got the completed Transaction
      console.log(`Transaction confirmed in round ${status['confirmed-round']}.`);
      console.log(status);
      break;
    }

    status = await AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/pending/' + tx.txId
    });
  }
  
  return {txId: tx.txId, assetID: status['asset-index']};
}