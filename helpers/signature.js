const express = require('express'); 

const generateSignature = (req, res , next) => {
    const content = json.dumps(payload) + nets_api_skey
    const hash = hashlib.sha256(content.encode("utf-8")).hexdigest().upper()
    const sig = base64.b64encode(bytes.fromhex(hash)).decode("utf-8")
    return sig
}

module.exports = generateSignature;