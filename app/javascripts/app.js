// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Store contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Store abstraction. We will use this abstraction
 * later to create an instance of the Store contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import Store_artifacts from '../../build/contracts/Store.json'

var Store = contract(Store_artifacts);

let creators = {};
let consumers = {};
let index = 0;

window.setAccount = function() {
  index = $("#account").val();
  web3.eth.defaultaAccount = web3.eth.accounts[index];
  $("#logs").html(web3.eth.defaultaAccount + "</br>");
  Store.deployed().then(function(contractInstance) {
    contractInstance.allCreators.call().then(function(candidateArray) {
      //candidateArray --> byte32[] datatype
      for(let i = 0; i < candidateArray.length; i++) {
        // console.log("candidateArray: " + candidateArray[i] + " -> "+web3.toUtf8(candidateArray[i]));
        creators[web3.eth.accounts[i]] = web3.toUtf8(candidateArray[i]);
      }
      if (web3.eth.defaultaAccount in creators) {
        loadCreator();
      }
      else {
        loadConsumer();
      }
    });
  });
  console.log("setAccount: " + web3.eth.defaultaAccount);
}

window.addCreation = function() {
  let creatorAddress = web3.eth.defaultaAccount;
  let mediaTitle = $("#title").val();
  let mediaPrice = parseInt($("#price").val());
  // let mediaHash = mediaTitle;
  Store.deployed().then(function(contractInstance) {
    contractInstance.addMedia.sendTransaction(creatorAddress, mediaTitle, mediaTitle, mediaPrice, {gas: 140000, from: web3.eth.accounts[0]}).then(function(r) {
      console.log(r);
    });
  });
  setAccount();
}

function loadCreator() {
  $("#logs").append(" user is a creator. Display creator content </br>");
  let address = web3.eth.defaultaAccount;
  Store.deployed().then(function(contractInstance) {
    contractInstance.getWallet.call(address).then(function(balance) {
      $("#logs").append("<h3>Your account balance :  $"+balance.toString()+"</h3>");
    });
  });
  Store.deployed().then(function(contractInstance) {
    contractInstance.getMediaCount.call(address).then(function(mediaSize) {
      let mediaCount = parseInt(mediaSize.c[0]);
      if (mediaCount != 0) {
        $("#logs").append('<h3>You have uploaded '+mediaCount+' creations.</h3><pre id="json"></pre>');
        for (let i = 0; i < mediaCount; i++) {
          Store.deployed().then(function(contractInstance2) {
            contractInstance2.getMedia.call(address, i).then(function(r) {
              console.log(r);
              document.getElementById("json").innerHTML += JSON.stringify(r, undefined, 2);
            });
          });
        }
      }
      else {
        $("#logs").append("<h3>You have not uploaded any creations yet.</h3>");
      }
      $("#logs").append('<input type="text" id="title" class="col-sm-2" placeholder="Title of the creation"/>&nbsp;');
      $("#logs").append('<input type="text" id="price" class="col-sm-2" placeholder="Price"/>&nbsp;');
      $("#logs").append('<a href="#" onclick="addCreation()" class="btn btn-primary">Add Media</a><hr>');
    });
  });
}

function loadConsumer() {
  $("#logs").append(" user is a consumer. Display consumer content </br>");
  Store.deployed().then(async function(contractInstance) {

    for (var key in creators) {
      $("#logs").append('</br><button type="button" class="btn btn-info" data-toggle="collapse" data-target=#'+creators[key]+'>'+creators[key]+'</button><div id='+creators[key]+' class="collapse"></div>');
      let address = key;
      var mediaSize = await contractInstance.getMediaCount.call(address);
      // .then(function(mediaSize) {

        let mediaCount = parseInt(mediaSize.c[0]);
        if (mediaCount != 0) {
          $("#"+creators[key]).append(mediaCount+' songs');
          // </h3><pre id="json"></pre>');
          // for (let i = 0; i < mediaCount; i++) {
          //   Store.deployed().then(function(contractInstance2) {
          //     contractInstance2.getMedia.call(address, i).then(function(r) {
          //       console.log(r);
          //       document.getElementById("json").innerHTML += JSON.stringify(r, undefined, 2);
          //     });
          //   });
          // }
        }
        else {
          $("#"+creators[key]).append('No songs');
        }

      // });
    }
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Store.setProvider(web3.currentProvider);
  web3.eth.defaultaAccount = web3.eth.accounts[index];
  $("#account").val(0);
  setAccount();
  // console.log(web3.eth.defaultaAccount);
});
