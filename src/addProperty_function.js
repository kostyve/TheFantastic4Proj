const database = firebase.database();

function addProperty(aptIdIN, cityIN, descriptionIN, floorIN, isRentedIN, leasedOnIN, maxLeaseIN, minLeaseIN, ownerIdIN, picturesIN, priceIN, streetIN, streetNumIN, studentIdIN, zipIN) {
  firebase.database().ref('apartments/' + aptIdIN).set({
    city: cityIN,//string exemple: "ashdod"
    description: descriptionIN,//string exemple: "have 3 rooms and a swimming pool"
    floor: floorIN,//int exemple: 1
    isRented: isRentedIN,//bolean exemple: true
    leasedOn: leasedOnIN,//string exemple: "1.1.1990"
    maxLease: maxLeaseIN,//int exemple: 0
    minLease: minLeaseIN,//int exemple: 1
    ownerId: ownerIdIN,//int exemple: 1234
    pictures: picturesIN,//path exemple: "somthing/othersomthingIN/pictureName.png"
    price: priceIN,//string exemple: "150$"
    street: streetIN,//string exemple: "rogozin"
    streetNum: streetNumIN,//int exemple: 15
    studentId: studentIdIN,//int exemple: 4321
    zip: zipIN//int exemple: 704501
  });
}
