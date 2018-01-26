pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract Store {

  // We use the struct datatype to store the voter information.
  struct Media {
    bytes32 title;
    address[] audience;
    uint price;
  }

  struct Creator {
    bytes32[] mediaList;
  }

  mapping (address => uint) public wallets;
  mapping (bytes32 => Media) mediaStructs;
  mapping (address => Creator) creatorStructs;
  bytes32[] public creatorsList;
  bytes32[] public consumersList;

  /* When the contract is deployed on the blockchain, we will initialize
   the total number of tokens for sale, cost per token and all the candidates
   */
  function Store(bytes32[] candidateNames1, bytes32[] candidateNames2) public {
    creatorsList = candidateNames1;
    consumersList = candidateNames2;
  }

/*
  function buy(bytes32 code) payable public {
    uint req_cost;
    uint i;
    bytes32 hashcode;
    for(i = 0; i < creatorStructs[creatorAddress].mediaList.length; i++) {
      hashcode = creatorStructs[creatorAddress].mediaList[i];
      if (creatorStructs[creatorAddress].mediaStructs[hashcode].title == mname) {
        req_cost = creatorStructs[creatorAddress].mediaStructs[hashcode].price;
        break;
      }
    }
    require(req_cost == cost);
    creatorStructs[creatorAddress].mediaStructs[hashcode].audience.push(msg.sender);
    wallets[creatorAddress] += cost;
    // return wallets[creatorAddress];
  }
  */

  function addMedia(bytes32 code, bytes32 mname, uint cost) public {
    creatorStructs[msg.sender].mediaList.push(code);
    mediaStructs[code].title = mname;
    mediaStructs[code].price = cost;
    // return (mediaStructs[code].title, mediaStructs[code].price, creatorStructs[msg.sender].mediaList.length);
  }

  function allCreators() view public returns (bytes32[]) {
    return creatorsList;
  }

  function allConsumers() view public returns (bytes32[]) {
    return consumersList;
  }

  function getWallet(address creatorAddress) view public returns (uint) {
    return wallets[creatorAddress];
  }

  function getMedia(address creatorAddress, uint index) view public returns (bytes32, bytes32, address[], uint) {
    bytes32 hashcode = creatorStructs[creatorAddress].mediaList[index];
    return (hashcode, mediaStructs[hashcode].title, mediaStructs[hashcode].audience, mediaStructs[hashcode].price);
  }

  function getMediaCount(address creatorAddress) view public returns (uint) {
    return creatorStructs[creatorAddress].mediaList.length;
  }

}
