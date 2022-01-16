import React, { Component, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { withTracker } from 'meteor/react-meteor-data';

function Asset(props){
    let { assetID } = useParams();
    const [assetInfo, setAssetInfo] = useState({rent: 0, assetName: "", assetTotal: 0, current_owner: "", url: ""});

    useEffect(() => { 
      const fetchData = async () => {
        console.log("fetching data "+assetID);
        const assetInfoAlgo = await AlgoSigner.algod({
          ledger: 'TestNet',
          path: `/v2/assets/${assetID}`
        });
        console.log(assetInfoAlgo);
        // works in Chrome inspector
        // PVContracts.find({"assetID": parseInt("59447432")}).fetch()
        let contracts = props.contracts.filter((contract) => contract.assetID == parseInt(assetID));
        const ipfsID = assetInfoAlgo.params.url;
        console.log(contracts)
        if(contracts.length == 0){
          return;
        }
        const rent = contracts[0].rent;
        const current_owner = contracts[0].current_owner;
        let assetInfo = {rent, assetName: assetInfoAlgo.params.name, assetTotal: assetInfoAlgo.params.total, current_owner, url: ""}
        console.log(assetInfo);
        setAssetInfo(assetInfo);

        // can take long because public ipfs gateway is slow sometimes
        let metadata = {};
        await axios({
          method: "get",
          url: `https://ipfs.io/ipfs/${ipfsID.substr(7)}`,
        })
        .then(function (resp) {
          metadata = resp.data.properties;
        })
        .catch(function (error) {
          console.log(error);
        });
      
        console.log(metadata.file_url)
        const url = metadata.file_url;
        assetInfo = {rent, assetName: assetInfoAlgo.params.name, assetTotal: assetInfoAlgo.params.total, current_owner, url}
        console.log(assetInfo);
        setAssetInfo(assetInfo);
      }
    
      fetchData()
        .then(()=>console.log(assetInfo))
        .catch(console.error);
    }, [props.contracts]);

    const ipfsURL = assetInfo.url;
    return (
      <div>
        <section className="section">
          <div className="container">
            <h1 className="title">Asset facts: {assetID}</h1>
            <div>
              <div>Name: {assetInfo.assetName}</div>
              <div>Total: {assetInfo.assetTotal}</div>
              <div>Current owner: <span style={{fontSize: "12px"}}>{assetInfo.current_owner}</span></div>
              <div>Monthly rent: {assetInfo.rent} USD</div>
              <div><img src={ipfsURL}/></div>
            </div>
          </div>
        </section>
      </div>
    );

}

const AssetTracked = withTracker(({ }) => {
  const contracts = PVContracts.find().fetch();
  return {
    contracts,
  };
})(Asset);

export default AssetTracked;
