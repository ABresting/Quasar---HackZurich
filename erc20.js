const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, Keys, CLValue, CLType, CLKey } = require('casper-js-sdk')
const { Option, Some } = require('ts-results')
const fs = require('fs')
const client = new CasperClient("http://136.243.187.84:7777/rpc")
const contract = new Contracts.Contract(client)

const keyPairFilePath = "/home/xx/code/hz/cep-78-enhanced-nft/keys/secret_key.pem"
const keys = getKeys()
const keys1 = getKeys()

const network = "casper-test"
// const contractHash = ""


var name = "AXA Coin"
var symbol = "AXA"


async function installContract() {

  const zero = new Some(CLValueBuilder.u8(0))
  const schema = {
	"properties": {
		"user_data": {
    	"name": "First Name Last Name",
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
    // "NAME_KEY_NAME": CLValueBuilder.string(name),
    // "SYMBOL_ENTRY_POINT_NAME": CLValueBuilder.string(symbol),
    // "TOTAL_SUPPLY_KEY_NAME": CLValueBuilder.u64(21000000),
    // "DECIMALS_ENTRY_POINT_NAME": CLValueBuilder.u8(18)
  });

  const deploy = contract.install(
    getWasm("/home/xx/code/hz/erc20/target/wasm32-unknown-unknown/release/erc20_test.wasm"),
    args,
    "150000000000", //180 CSPR
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

//#########################################################
async function mint(contractHash) {
  contract.setContractHash(contractHash)


  const args = RuntimeArgs.fromMap({

    "owner": keys.publicKey,
    "amount": CLValueBuilder.u256(10  )
  })

  const deploy = contract.callEntrypoint(
    "mint",
    ["0179b92bca6d60d590fa13cdede234178c11e2f9065b3530f0708b99c31a15ef46", 10],
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




installContract()
// mint("hash-452ae6be87013bd0a893f3285551e24be7b093bbcfcef477cd302658e5342450")
// update_metadata("hash-058b425c462efd0a7150f27da668d975fb574cb03342e3b8029e74815f842770")