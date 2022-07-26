// const express = require('express');
// const router = express.Router();
// const flashMessage = require('../helpers/messenger');
// var strftime = require('strftime')  
// const nets_api_key = "231e4c11-135a-4457-bc84-3cc6d3565506"
// const nets_api_skey = "16c573bf-0721-478a-8635-38e53e3badf1"
// // nets_api_server = "https://0ruj5din0d.execute-api.ap-southeast-1.amazonaws.com/live"
// const nets_api_server  = "https://uat-api.nets.com.sg:9065"
// const nets_api_gateway = {
//     "request":`${nets_api_server}/uat/merchantservices/qr/dynamic/v1/order/request`,
//     "query": `${nets_api_server}/uat/merchantservices/qr/dynamic/v1/transaction/query`,
//     "void": `${nets_api_server}/uat/merchantservices/qr/dynamic/v1/transaction/reversal`
// }

// router.get("/request/<int:amount>"), (req, res)=>
// {
//     date = Date.now()
//     var stan = 0

//     if (stan >= 1000000){
//         stan = 1
//     }
        
//     else{
//         stan += 1
//     }
        
//     const payload = json.load(open(f"{os.getcwd()}/config/nets-qr-request.json", "r"))
//     payload.amount = str(amount);
//     payload.npx_data.E201 = payload.amount;
//     payload.stan = `${stan}`;
//     payload.transaction_date = date.strftime('%m%d')
//     payload.transaction_time = date.strftime('%H%M%S')
//     headers = {
//         "Content-Type": "application/json",
//         "KeyId": nets_api_key,
//         "Sign": generate_signature(payload)
//     }
//     request = requests.request(
//         timeout=2.0,
//         method="POST",
//         url=nets_api_gateway["request"],
//         headers=headers,
//         data=json.dumps(payload))

//     if request.ok:
//         response = request.json()
//         return flask.Response(json.dumps({
//             "txn_identifier": response["txn_identifier"],
//             "amount": response["amount"],
//             "stan": response["stan"],
//             "transaction_date": response["transaction_date"],
//             "transaction_time": response["transaction_time"],
//             "qr_code": response["qr_code"]
//         }), status=200)
//     else:
//         return flask.Response(request.json(), status=request.status_code)
//     }

// @router.post("/query")
// def payment_query():
//     payload = json.load(open(f"{os.getcwd()}/config/nets-qr-query.json", "r"))
//     #	TODO:	Update payload
//     content = flask.request.json
//     payload["amount"] = content["amount"]
//     payload["stan"] = content["stan"]
//     payload["transaction_date"] = content["transaction_date"]
//     payload["transaction_time"] = content["transaction_time"]
//     payload["txn_identifier"] = content["txn_identifier"]

//     headers = {
//         "Content-Type": "application/json",
//         "KeyId": nets_api_key,
//         "Sign": generate_signature(payload)
//     }
//     request = requests.request(
//         timeout=2.0,
//         method="POST",
//         url=nets_api_gateway["query"],
//         headers=headers,
//         data=json.dumps(payload))

//     if (request.ok):
//         return flask.Response(json.dumps(request.json()), status=request.status_code)
//     else:
//         return flask.Response(json.dumps(request.json()), status=request.status_code)


// @router.post("/void")
// def payment_void():
//     payload = json.load(open(f"{os.getcwd()}/config/nets-qr-void.json", "r"))
//     #	TODO:	Update payload
//     #	TODO:	Update payload
//     content = flask.request.json
//     payload["amount"] = content["amount"]
//     payload["stan"] = content["stan"]
//     payload["transaction_date"] = content["transaction_date"]
//     payload["transaction_time"] = content["transaction_time"]
//     payload["txn_identifier"] = content["txn_identifier"]

//     headers = {
//         "Content-Type": "application/json",
//         "KeyId": nets_api_key,
//         "Sign": generate_signature(payload)
//     }
//     request = requests.request(
//         timeout=2.0,
//         method="POST",
//         url=nets_api_gateway["void"],
//         headers=headers,
//         data=json.dumps(payload))

//     if (request.ok):
//         return flask.Response(json.dumps(request.json()), status=request.status_code)
//     else:
//         return flask.Response(json.dumps(request.json()), status=request.status_code)



// module.exports = router;