import React, { Component, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

export default function About(props){
    let { assetID } = useParams();
    const [assetInfo, setAssetInfo] = useState({rent: 100, assetName: "", assetTotal: 0, current_owner: "", url: ""});

    useEffect(() => { 
      const fetchData = async () => {
        console.log("fetching data "+assetID);
        const assetInfoAlgo = await AlgoSigner.algod({
          ledger: 'TestNet',
          path: `/v2/assets/${assetID}`
        });
        console.log(assetInfoAlgo);
        const pvasset = PVAssets.findOne({assetID}) || {rent: 100};
        let contracts = PVContracts.find({assetID}).fetch();
        if(contracts.length == 0){
          contracts = [
            {"current_owner": "MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU", assetName: "Susanne's PV", assetTotal: 10, assetID: 57939801, rent: 800},
          ]
        }
        const ipfsID = assetInfoAlgo.params.url;
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
        const assetInfo = {rent: pvasset.rent, assetName: assetInfoAlgo.params.name, assetTotal: assetInfoAlgo.params.total, current_owner: contracts[0].current_owner, url}
        console.log(assetInfo);
        setAssetInfo(assetInfo);
      }
    
      fetchData()
        .then(()=>console.log(assetInfo))
        .catch(console.error);
    }, []);

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
              <div>Monthly rent: {assetInfo.rent} USDC</div>
              <div><img src={ipfsURL}/></div>
            </div>
          </div>
        </section>
      </div>
    );

}
