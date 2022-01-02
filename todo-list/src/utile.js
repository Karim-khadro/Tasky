var CryptoJS = require("crypto-js");


export function decrypt(ciphertext) {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.REACT_APP_ENCRYPT_SECRET);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    //log decrypted Data
    // console.log('decrypted Data -')
    // console.log(decryptedData);
    return decryptedData;
}


export function encrypt(data) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(data, process.env.REACT_APP_ENCRYPT_SECRET).toString();
    //log encrypted data
    // console.log('Encrypt Data -')
    // console.log(ciphertext);
    return ciphertext;
}

export function renewToken() {
    //get the mins of the current time
    console.log('renewToken');
    var refToken = localStorage.getItem('refreshToken');
    if (refToken) {
        refToken = decrypt(refToken);
        fetch(process.env.REACT_APP_BACKEND_API_URL + '/user/newtoken', {
            method: 'Get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "token": "ref_token",
                'Authorization': "Bearer " + refToken
            },
        }).then(res => res.json())
            .then(res => {
                if (res.isauth) {
                    // Encrypt the refresh token & store it
                    const cipherToekn = encrypt(res.refreshtoken);
                    localStorage.setItem('refreshToken', cipherToekn);
                }
            }).catch(err => console.error(err));
    }
}