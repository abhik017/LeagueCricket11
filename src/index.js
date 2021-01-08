var sha256 = require('js-sha256');

module.exports = {

    headers: {
        'authorization': 'YOUR-AUTHORIZATION-HEADER' // will be provided by bhartipay
    },

    credentails: {
        'pay_id': '7653501230164640', // will be provided by bhartipay
        'salt': 'd6d03834d9604375', // will be provided by bhartipay
    },
    
    setCredentails: function(pay_id, salt) {
        this.credentails.pay_id = pay_id;
        this.credentails.salt = salt;
    },
    generateHash: function(data) {
        var preHashString = "";
        var dataKeys = ['AMOUNT','CURRENCY_CODE','CUST_CITY','CUST_COUNTRY','CUST_EMAIL','CUST_NAME','CUST_PHONE','CUST_SHIP_CITY','CUST_SHIP_COUNTRY','CUST_SHIP_NAME','CUST_SHIP_PHONE','CUST_SHIP_STATE','CUST_SHIP_STREET_ADDRESS1','CUST_SHIP_ZIP','CUST_STATE','CUST_STREET_ADDRESS1','CUST_ZIP','ORDER_ID','PAY_ID','PRODUCT_DESC','RETURN_URL','TXNTYPE'];
        dataKeys.forEach(function(key) {
            preHashString += key+"="+data[key]+"~";
        });

        if (data['MERCHANT_PAYMENT_TYPE'] && data['MERCHANT_PAYMENT_TYPE'] != "") {
            preHashString += "MERCHANT_PAYMENT_TYPE="+data['MERCHANT_PAYMENT_TYPE']+"~";
        }

        preHashString = preHashString.substring(0, preHashString.length - 1); // remove extra ~

        return sha256(preHashString + 'd6d03834d9604375').toUpperCase();
    },

    createTransaction: function(data) {
        var hash = this.generateHash(data);

        return Object.assign(data, {'HASH' : hash});
    }
};