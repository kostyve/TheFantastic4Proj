
/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */


const fs = require('fs');
const jasonPath = "thefantastic4-5037d-export.json";

let rawdata = fs.readFileSync(jasonPath);
let jasonFile = JSON.parse(rawdata);

var test = getMyProperty(jasonFile);

function getMyProperty(apartments, id){
  const data = apartments;
  let apartmentsId;

  let count = Object.keys(apartments.apartments).length;
  for (var i = 0; i < count; i++) {
    apartmentsId[i] = apartments.apartments;
  }

  console.log(data);
data.response.forEach((item, i) => {

});

  /*
  apartmentsId.forEach((item, i) => {
    console.log(item);
  });
*/
}
