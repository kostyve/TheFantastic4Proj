function trackingOrder() {
    console.log("Order ID : " /*+ jsonFile.orders.orderid.aptId*/);
    console.log("Apartment ID : " + jsonFile.orders.orderid.aptId);
    console.log("Landlord ID : " + jsonFile.orders.orderid.landlordId);
    console.log("Order date : " + jsonFile.orders.orderid.orderDate);
    console.log("Renting time : " + jsonFile.orders.orderid.rentingTime);
    console.log("Student ID : " + jsonFile.orders.orderid.studentId);
    console.log("Price : " + jsonFile.orders.orderid.totSum);
}


const db = require('fs');
const PATH = 'DB.json';

let data = db.readFileSync(PATH);
let jsonFile = JSON.parse(data);
