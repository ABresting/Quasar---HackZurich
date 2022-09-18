const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, Keys, CLValue, CLType, CLKey } = require('casper-js-sdk')
const { Option, Some } = require('ts-results')
const fs = require('fs')
const client = new CasperClient("http://136.243.187.84:7777/rpc")
const contract = new Contracts.Contract(client)

const keyPairFilePath = "/root/zurich/secret_key.pem"
const keys = getKeys()
const keys1 = getKeys()

const network = "casper-test"
// const contractHash = ""


var collection_name = "AXA Coin"
var collection_symbol = "AXA"


async function installContract() {

  const zero = new Some(CLValueBuilder.u8(0))
  const schema = {
	"properties": {
		"user_data": {
    	"address": "crypto address",
      "required": true,
   	},
    "nft_data": {
    	"type": "Type name",
      "uri": "address",
      "count": "0",
      "required": true,
   	}
  }
}

  const args = RuntimeArgs.fromMap({
    "collection_name": CLValueBuilder.string(collection_name),
    "collection_symbol": CLValueBuilder.string(collection_symbol),
    "total_token_supply": CLValueBuilder.u64(1000),
    "ownership_mode": CLValueBuilder.u8(2),
    "nft_kind": CLValueBuilder.u8(1),
    "holder_mode": CLValueBuilder.option(zero),
    "nft_metadata_kind": CLValueBuilder.u8(2),
    "json_schema": CLValueBuilder.string(JSON.stringify(schema)),
    "identifier_mode": CLValueBuilder.u8(0),
    "metadata_mutability": CLValueBuilder.u8(1)
  });

  const deploy = contract.install(
    getWasm("/home/xx/code/hz/cep-78-enhanced-nft/contract/target/wasm32-unknown-unknown/release/contract.wasm"),
    args,
    "180000000000", //180 CSPR
    keys.publicKey,
    network,
    [keys]
  )

  var deployHash
  try {
    deployHash = await client.putDeploy(deploy)
  } catch(error) {
    console.log(error)
  }

  // var contractHash
  try {
    const result = await pollDeployment(deployHash)
    const contractHash = iterateTransforms(result)
  	console.log("Contract hash: " + contractHash)

  } catch(error) {
    console.error(error)
  }

  // const contractHash = contract_hash //Set this up up top using a String, not the variable `contract_hash`

}

// ########### UPDATE METADATA ############
async function update_metadata(contractHash) {
  contract.setContractHash(contractHash)
  const data_update = {
    "user_data": {
    	"name": "Taurn V"
    },
    "nft_data": { "type": "Happy TARUN",
        "uri": "https://stochastic.life/public/img/instaprofile.jpg",
        "count": "0"
    }
  }

  // var str_meta = JSON.stringify(data_update)

const arg = RuntimeArgs.fromMap({
    "token_meta_data": CLValueBuilder.string(JSON.stringify(data_update))
  })


  // keys1.publicKey.data = new Uint8Array([170, 192, 171, 143, 22, 110, 131, 100, 154, 227, 55, 188, 42, 243, 6, 136, 201, 186, 53, 47, 14, 199, 211, 99, 95, 197, 49, 140, 103, 164, 220, 161])

const deploy = contract.callEntrypoint(
    "owner_of",
    "",
    keys.publicKey,
    network,
    "2000000000", // 1 CSPR
    [keys]
  )

  var deployHash
  try {
    deployHash = await client.putDeploy(deploy)
  } catch(error) {
    console.log(error)
  }

  var result
  try {
    result = await pollDeployment(deployHash)
  } catch(error) {
    console.error(error)
  }

  console.log("Result: " + result)

}
//#########################################################
async function mint(contractHash) {
  contract.setContractHash(contractHash)

  const metadata = {
    "user_data": {
    	"name": "John Doe"
    },
    "nft_data": { "type": "Active Hackathon",
        "uri": "https://stochastic.life/public/img/instaprofile.jpg",
        "count": "1"
    }
  }

  keys1.publicKey.data = new Uint8Array([170, 192, 171, 143, 22, 110, 131, 100, 154, 227, 55, 188, 42, 243, 6, 136, 201, 186, 53, 47, 14, 199, 211, 99, 95, 197, 49, 140, 103, 164, 220, 161])

  const args = RuntimeArgs.fromMap({

    "token_owner": keys.publicKey,
    "token_meta_data": CLValueBuilder.string(JSON.stringify(metadata))
  })

  const deploy = contract.callEntrypoint(
    "mint",
    args,
    keys.publicKey,
    network,
    "1000000000", // 1 CSPR
    [keys]
  )

  var deployHash
  try {
    deployHash = await client.putDeploy(deploy)
  } catch(error) {
    console.log(error)
  }

  var result
  try {
    result = await pollDeployment(deployHash)
  } catch(error) {
    console.error(error)
  }

  console.log("Result: " + result)
}

function getKeys() {
  return Keys.Ed25519.loadKeyPairFromPrivateFile(keyPairFilePath)
}

function getWasm(file) {
  try {
    return new Uint8Array(fs.readFileSync(file).buffer)
  } catch (err) {
    console.error(err)
  }
}

function pollDeployment(deployHash) {
  return new Promise((resolve, reject) => {
    var poll = setInterval(async function(deployHash) {
      try {
        response = await client.getDeploy(deployHash)
    	  if (response[1].execution_results.length != 0) {
           //Deploy executed
           if (response[1].execution_results[0].result.Failure != null) {
             clearInterval(poll)
             reject("Deployment failed")
             return
           }
           clearInterval(poll)
           resolve(response[1].execution_results[0].result.Success)
         }
  	  } catch(error) {
        console.error(error)
  	  }
    }, 2000, deployHash)
  })
}

function iterateTransforms(result) {
  const transforms = result.effect.transforms
  for (var i = 0; i < transforms.length; i++) {
    if (transforms[i].transform == "WriteContract") {
      return transforms[i].key
    }
  }
}




// installContract()
mint("hash-b9ca1f56c0729b4eac293485323009f5218634e9ff36da66a62dbdca935543c4")
// update_metadata("hash-058b425c462efd0a7150f27da668d975fb574cb03342e3b8029e74815f842770")
