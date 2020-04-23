'use strict';

console.log('Loading function');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
const requestId = context.awsRequestId;
const e = JSON.parse(event.body);
await createOrder(requestId, e).then(() => {
    callback(null, {
        statusCode: 201,
        body: JSON.stringify(e),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    });
}).catch((err) => {
    console.error(err)
})    
};


function createOrder(requestId, event) {
    if (processPayment(event)) 
    {
    const params = {
        Item: {
            OrderKey: requestId,
            OrderDate: Date.now(),
            CustomerId: event.customerid,
            OrderType: event.ordertype,
            OrderStatus: "Confirmed",
            OrderItems: {
                "Item1": event.orderitem1,
                "Item2": event.orderitem2,
                "Item3": event.orderitem3,
                "Item4": event.orderitem4,
            },

            OrderTotal: event.ordertotal,
            PaymentType: event.paymenttype,
            PaymentDetails: {
                "cardnumber": event.cardnumber,
                "cardname": event.cardname,
                "zipcode": event.zipcode,
                "securitycode": event.securitycode,
                "billingaddress": event.billingaddress,
                "expirydate": event.expirydate
            },
            PaymentApproved: true,
            OutputMessage : event.cardname + ", Thank you for your order - it will be ready for " + event.ordertype + " in 15 minutes"
        },

        TableName: 'Order'

    }
    

    return docClient.put(params).promise();
    }    
    else 
    {
    const params = {
        Item: {
            OrderKey: requestId,