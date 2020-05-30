/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//ref to the dom though the class name, which is : class="collapsible z-depth-0 apartments"
const apartmentList = document.querySelector('.apartments');
//ref to the logged out class so that we could implement button hiding when user is logged in/out
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
//ref to the logged in accout
const accountDetails = document.querySelector('.account-details');
//ref to dashboard aprt list.
const dashboard = document.querySelector('.owned-Apartments');
//make a ref for admin items, most likely it will be set to landlord
const adminItems = document.querySelectorAll('.admin');
//make a ref for user items.
const userItems = document.querySelectorAll('.user');
//make a ref for the search bar.
const searchEngine = document.querySelectorAll('.search-engine');

/* CONDITIONAL MENU LINKS we setup UI elements according to:
 will get a user as a parameter, and inside we want to check
 if the user exists or not and we will show or hide the links accordingly*/
const setupUI = (user) => {
  //toggle UI elements
  if (user) {
    // check if he has admin token if so, then present all the admin items
    if(user.admin){
      adminItems.forEach(item => item.style.display = 'block');
    }else {
      userItems.forEach(item => item.style.display = 'block');
    }
    //account info from db by the user id weve setup before. POTENTIALLY CHANGE IT TO GOOGLE FUNCTIONS
    db.collection('users').doc(user.uid).get().then(doc => {
      //get the account info of the user and we input his into into the DOM
      //we will use in case of an admin a check. if user is admin then 'Admin' else ''
      const html = `
      <div>Logged in as ${user.email}</div>
      <div>${doc.data().firstName} ${doc.data().familyName}</div>
      <div class="green-text">${user.admin ? 'Landlord' : 'Student'}</div>
      `;
      // get the account-details class of the inner html
      accountDetails.innerHTML = html;
    });

    // display = block means to show the items, where as none is to hide them
    loggedInLinks.forEach(item => item.style.display = 'block');
    searchEngine.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');

  }else{
    //hide admin items
    adminItems.forEach(item => item.style.display = 'none');
    searchEngine.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    //hide the account info
    accountDetails.innerHTML = '';
  }
}

// setup MATERIALIZE components
document.addEventListener('DOMContentLoaded', function() {
  //M is materialize library, propery Modal, we init it will all our modals
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  //same just with the collaprsibles eg the apartments
  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  var elems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(elems);

});


//setup apartments
const setupApts = (attrData, data, isAdmin, searchWord="") => {
  //check len on the data, if we have no length then user is not logged in. we show different data
  if (data.length){
      //we need to create a template and run through our data and input it inside
    let html = '';

    data.forEach(doc => {
      const apt = doc.data();

      if(apt.city.includes(searchWord) || apt.street.includes(searchWord)){
      // we summ our const li templates appending each cycle
        const li = readApartments(attrData, doc.id, apt,isAdmin);
        html += li;
        }
      // so lets say if we run this 3 times in the data loop there will be 3 sets of li

    });


    apartmentList.innerHTML = html; // here were taking all our code created and outputting it to the dom
      // that is, in our container mentioned above in the head of this file
  }else{
    apartmentList.innerHTML = '<h5 class="center-align">Login to view available apartments</h5>';
  }

};

const getMyOwnAprts = (attrData, data, isAdmin=false) => {
  //this function get the current user apartments,total income, avarage income and
  // everything that should be in the dashboard.
  let countTotalApt=0;
  let countTotalRentedApt=0;
  let totalIncome=0;
  const user = auth.currentUser;

  //check len on the data, if we have no length then user is not logged in. we show different data
  if (data.length){
    //the final output to the dashboard.
    let html = '';
    //list of all the apartments.
    apartmentsList = '';
    data.forEach(doc => {
      const apt = doc.data();
      //(search engine)check if searchWord is part of the aprtment city name.

      if(user.uid==apt.ownerId){
        countTotalApt++;
        if(apt.rented==true){
          countTotalRentedApt++;
          totalIncome += Number(apt.price);
        }
      }
      const li = readApartments(attrData, doc.id ,apt, isAdmin, user.uid, true);
      apartmentsList += li;
    });

    //if the user is admin show the currect information(owned apartments and incomes) in the dashboard
    if(isAdmin){
    html += `
            <li>
              <div class="row">
              <div class="col s6">
    `;
    //Dashboard personal statistics for landlord(Left side).
    html += `
                <table>
                  <div id="site-layout-example-top" class="col s12 card-panel grey lighten-2">
                    <b>Personal statistics:</b>
                  </div>
                  <tbody>
                    <tr>
                      <td>Total rented apartments:</td>
                      <td>${countTotalRentedApt}</td>
                    </tr>
                    <tr>
                      <td>Avarage income:</td>
                      <td>${totalIncome/countTotalRentedApt}</td>
                    </tr>
                    <tr>
                      <td>Total income:</td>
                      <td>${totalIncome}</td>
                    </tr>
                    <tr>
                      <td>Total owned apartments:</td>
                      <td>${countTotalApt}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
      `;
      //Dashboard personal statistics for landlord(Right side).
      html += `
                  <div class="col s6">
                    <div id="site-layout-example-top" class="col s12 card-panel grey lighten-2">
                      <b>Place holder</b>
                    </div>

      `;
       html += `

                    </div>
                  </div>
                  <div>
                </div>
            </li>
            <div id="site-layout-example-top" class="col s12 card-panel grey lighten-2">
              <h4>Owned apatrments:</h4>
            </div>
      `;
    }else{
      //else->show normal user dashboard information(probably rented apartment or nothing).

      html += `
              <li>
                ${"<h6><b>Rented apartments:</h6>"}
              </li>
      `;
    }
    html += apartmentsList;
    if(html == ''){//if the user dont own any apartments.
      dashboard.innerHTML = "you dont have any apartments in the database.";
    }else{
      //output li(user apartments) list to the user dashbord.
      dashboard.innerHTML = html;
    }
  }else{
  dashboard.innerHTML = '<h5 class="center-align">Login to view available apartments</h5>';
  }
};

function readApartments(attrData, aptId, apt, isAdmin = false,id = apt.ownerId, forDashBoard=false){
  //function for gettin list of apartments based on user id. This function populates setupApts with data
  //a template whic is dynamically constructed
  //backticks used in js to create template string. ${} is a placeholder
  let li=``;

  //[*had to do it this way] if user is admin or the output is *not* for dashboard
  //then compare (apt.ownerid==apt.ownerid)(witch mean its show all the apartments).
  //else compare (id == apt.ownerid)(witch show only student or only admin owned/rented aprtments).
  if((isAdmin)||(!forDashBoard)?(id==apt.ownerId):(id==apt.studentId)){
    //set up the collapsible gray thing.
    li= `
      <li>
        <div class="collapsible-header grey lighten-4">${apt.city+", "+apt.street}
            <i class="right small material-icons grey-text right">
    `;

    //collect all the apartments reviews to one collection(as string).

    let totalRating = 0;
    let collectReviws="";
    let rev="";
    let i,j,z;
    if(apt.reviews[0]==""){
      collectReviws+="<b><p>This apartment have no rviews.</b></p>";
    }else{

      totalRating=apt.reviews.length;
      for(j=0;j<apt.reviews.length;j++){
        if(apt.reviews.length == 1){
          collectReviws+=`
            This apartment dont have any reviews yet.
          `;
          //pass this one.
        }else{
          rev=apt.reviews[j];
          totalRating+=Number(rev.rating);
          collectReviws+="<b><p>"+"["+j+"]"+"Review rating:"+"</b>"+rev.rating+"</p>";
          collectReviws+="<p>"+rev.revMsg+"</p>";
        }
      }
    }


    if((Array.isArray(apt.reviews) && apt.reviews.length)==1){

      li+=`star_borderstar_borderstar_borderstar_borderstar_border`;

    }else {

      const avarageRating=(totalRating/apt.reviews.length)-1
      for(i=0;i<avarageRating;i++){
      li+=`stars`;
      }
      for(i=0;i<5-avarageRating;i++){
      li+=`star_border`;
      }
    }


    if((isAdmin==true) || (forDashBoard==false)){
      //if apartment is rented then spawn red circle, if not spawn green circle.
      if(apt.rented == true){
        li+=`<class="large material-icons" span class="red-text text-darken-2">account_circle</i>`;
      }else {
        li+=`<class="large material-icons" span class="green-text text-darken-2">brightness_1</i>`;
      }
    }else {
      if(forDashBoard==true){
      li+=`
      <div><a class="waves-effect green btn" onclick="addReview(${"'"+aptId+"'"})">Leave a review</a></div>
      `;
      }
      li+=`</i>`;
    }
      li+=`
      </div>
      <div class="collapsible-body white">
          <p>
          <div class="row">
        `;
    //for the thing that the collapsible open(that board thing)->(left side).
    li+=`
            <div class="col s6">
              <div id="site-layout-example-top" class="col s12 card-panel grey lighten-2">
                  <b>Apartment details:</b>
              </div>
              <div>${"<b>description:</b> "+apt.description}</div>
              <div>${"<b>Floor:</b> "+apt.floor}</div>
              <div>${"<b>Zip code:</b> "+apt.zip}</div>
              <div>${"<b>Price:</b> "+apt.price}</div>

    `;
    //if apartment is rented then put a "yes" to the variable, if not put "no".
    if(apt.rented==true){
      li +=  `<div>${"<b>Rented:</b> Yes"}</div>`;
      if(isAdmin==true){
        //if the user is admin->show the name of the creditCardId that rent the aprtment(relevent to the dashboard).
        li +=  `<div><b>student email:</b>${apt.studentName}</div>`;
      }
    }else{
        li +=  `<div>${"<b>Rented:</b> no"}</div>`;
      if(isAdmin==false){
        //admin cant buy apartment, and no one can buy rented apartment.
        li +=  `
        <div><a class="waves-effect green btn" onclick="Confirmation(${"'"+aptId+"'"})">press to order</a></div>
        `;
      }
    }
    if(apt.rented==false && forDashBoard == true){
      li +=  `
      <a href="#" class="waves-effect green btn modal-trigger" data-target="modal-edit" onclick="editFormFunc(${"'"+aptId+"'"})">Edit</a>
      `;
    }
      if(forDashBoard == true && isAdmin==true){
      li +=  `
      <a href="#" class="waves-effect green btn modal-trigger" data-target="modal-orders" onclick="getOrders(${"'"+aptId+"'"})">orders</a>
      `;
    }
    //for the thing that the collapsible open(that board thing)->(right side).
    li+=`
      </div>
            <div class="col s6">
              <div id="site-layout-example-top" class="col s12 card-panel grey lighten-2">
                  <b>Nearby attractions:</b>
              </div>
                <div style=": background-color: lightblue; width: 400px; height: 150px; overflow: scroll;">

    `;
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //list of attractions.
    if(attrData.length){
      let attr;
      li+=`
      <table>
        <thead>
            <tr>
              <th>${"No."}</th>
              <th>${"Place name"}</th>
              <th>${"Location"}</th>
            </tr>
        </thead>
      `;
      attrData.forEach((doc, i) => {
        attr=doc.data();
        if(attr.proximity.includes(aptId)){
          li+=`
            <tbody>
             <tr>
               <td>${"["+i+"]"}</td>
               <td>${attr.name}</td>
               <td>${attr.city+" "+attr.street}</td>
             </tr>
            </tbody>
          `;
        }
      });
    }else{
      li+=`
      This apartment dont have any attraction nearby.
      `;
    }
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    li+=`
                  </table>
                </div>
            </div>
    `;
      li+=`
          </div>
        </p>
      `;


    li +=  `
    <div class="row">
    `;

    li +=  `
    </div>
    `;

      li+=`
      <div><h5><b>Reviews:</b></h5></div>
      `;


      //add the collection of reviews msgs here.
      li+=`
      <div style=": background-color: lightblue; width: 500px; height: 150px; overflow: scroll;">
      ${collectReviws}
      </div>
      `;

      //close the thing that the collapsible open(that board thing).
    li+= `</div></li>`;
  }
  return li
}

function Confirmation(aptId=""){
  //function for testing.... will be deleted later..
  //let testString="starting:\n";
  var txt;
  var creditCardId = prompt("Credit card id:", "");
  if (creditCardId == null || creditCardId == "") {
    txt = "User cancelled the transaction.";
  } else {
    txt = "Transaction confirm!\nPaying with credit card: " + creditCardId;
    const user = auth.currentUser;

    //update the apartment.
    if(aptId!=""){
      rentAprt(aptId);
      addOrder(aptId, creditCardId);
    }
  alert(txt);
  }
}

function addOrder(aptId, creditCardId){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = ""+yyyy+"-"+mm+"-"+dd;
  const apt = db.collection('apartments').doc(aptId);
  db.collection('orders').add({
    aptId: aptId,
    cardId: creditCardId,
    studentId: auth.currentUser.uid,
    ownerId: apt.ownerId,
    orderDate: today,
    rentStart: "",
    rentEnd: "",
    totalSum: 0
  }).then(() => {

  }).catch(err => {
      console.log(err.message)
  });
}

function rentAprt(aptId, unRent=false){
  //update the apartment by aptId.
  const user = auth.currentUser;
  db.collection('apartments').doc(aptId).update({
    studentId: unRent?"":user.uid,
    studentName: unRent?"":user.email,
    rented: unRent?false:true
  }).then(()=>{

  }).catch(err => {
    console.log(err.message);
  });
}

function updateApartment(aptId, INcity="", INstreet="", INfloor="", INdescription="", INzip="", INprice=""){
  //this function apdate the apartments, only the apartment id.
  //all the rest have default value if not given any.
  let apt;
  let getDoc = db.collection('apartments').doc(aptId).get().then(doc => {
      if (!doc.exists) {
        console.log('error, cannot find document');
      } else {
        apt = doc.data();
      }
    })
  db.collection('apartments').doc(aptId).update({
    //if the INcoming is empty(equal to "") then change nothing.
    city: INcity==""?apt.city:INcity,
    street: INstreet==""?apt.city:INstreet,
    floor: INfloor==""?apt.city:INfloor,
    description: INdescription==""?apt.city:INdescription,
    zip: INzip==""?apt.city:INzip,
    price: INprice==""?apt.city:INprice,

  }).then(()=>{
  }).catch(err => {
    console.log(err.message);
  });
}

function addReview(aptId){
  let getDoc = db.collection('apartments').doc(aptId).get().then(doc => {
      let apt;
      if (!doc.exists) {
        console.log('error, cannot find the document.');
      } else {
        apt = doc.data();
      }

  //popup masseg and input field for review msg.
  let msg = prompt("Your review:", "");
  //popup masseg and input field for ratin(number[0-5]).
  let rating = prompt("Your rating(number between 0 to 5):", "");
  //check if rating is number.
  if(!isNaN==rating){
    const num = Number(rating);
    //check if the rating is between 0 to 5.
    if(!(num >= 0 && Number(rating) <=5)){
      alert("Rating must be number between 0 to 5.");
      return;
    }
  }

  let reviews=[];
  let rev={
    studentId: auth.currentUser.uid,
    rating:rating,
    revMsg:msg
  };
   if (Array.isArray(reviews) && reviews.length){
    reviews[0]=rev;
  }else {
    apt.reviews.forEach(item => {
      reviews.push(item);
    });

    reviews.push(rev);
  }


  db.collection('apartments').doc(aptId).update({
    reviews: reviews
  }).then(()=>{
    console.log("aprtment updated.");
  }).catch(err => {
    console.log(err.message);
  });
  alert("We added your review. \nthanks for your time.");
}).catch(err => {
  console.log('Error getting document', err);
});
}

function editFormFunc(aptId){
  //help pass the apartment id to the editForm section in the auth.js .
   document.getElementById('apt-id').textContent=aptId;
}

function getOrders(aptId){
  const ordersList = document.querySelector('.aprtment-orders');
  let  html = "<li>";
  //ordersList.innerHTML = '<h5 class="center-align">Login to view available apartments</h5>';

  db.collection('orders').where('aptId', '==', aptId).onSnapshot(snapshot => {
    const docs = snapshot.docs;
    console.log(auth.currentUser.uid);
    if(docs != ''){
    docs.forEach(doc => {
      const order = doc.data();
      html += `
        <li>
        <div class="collapsible-header"><i class="material-icons">
        </i>${order.orderDate}</div>
        <div class="collapsible-body"><span>
        <table>
          <tbody>
            <table>
          <tbody>
                 <tr>
                   <td>${"Apartment id: "}</td>
                   <td>${order.aptId}</td>
                 </tr>
                 <tr>
                   <td>${"Student id: "}</td>
                   <td>${order.studentId}</td>
                 </tr>
                 <tr>
                   <td>${"Order date: "}</td>
                   <td>${order.orderDate}</td>
                 </tr>
                 <tr>
                   <td>${"Credit card id: "}</td>
                   <td>${order.cardId}</td>
                 </tr>
                </tbody>
              </table>
            </span>
          </div>
        </li>
     `;
    });
    html += `</li>`;
  }else {
    html += `<h5>Cant find any orders history..</h5>`;
  }
  ordersList.innerHTML = html;
  html = '';
})
}

function setEditForm(data){
  const createForm = document.querySelector('.close-atractions');
  let numOfAttractions = 0;
  let html = `
    <h5>Chose nearby atractions:</h5>
    <div style=": background-color: lightblue; width: 500px; height: 150px; overflow: scroll;">
  `;
  const user = auth.currentUser;

  if (data.length){
    data.forEach(doc => {
      const atraction = doc.data();
        html +=`
            <p>
            <div class="row">
              <div class="col s12">
                    <div class="card gray-grey darken-1">
                      <label>
                        <input type="checkbox" id="checkAtrr${numOfAttractions}"  />
                        <span>
                          ${atraction.name+" "+atraction.city+" "+atraction.street}
                          <p id="closeAtrr${numOfAttractions}" style="display: none;">${doc.id}</p>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
            </p>
          `;
          numOfAttractions++;
    })
    html +=`
      <p id="numOfAttractions" style="display: none;">${numOfAttractions}</p>
    `;
  }
  html += `</div>`;
  createForm.innerHTML = html;
}

function setAtractionForm(data){
  const createForm = document.querySelector('.close-apartments');
  let numOfApartments = 0;
  let html = `
    <h5>Chose nearby apartments:</h5>
    <div style=": background-color: lightblue; width: 500px; height: 150px; overflow: scroll;">
  `;
  const user = auth.currentUser;

  if (data.length){
    data.forEach(doc => {
      const apt = doc.data();
      if(apt.ownerId==user.uid){
        html +=`
            <p>
            <div class="row">
              <div class="col s12">
                    <div class="card gray-grey darken-1">
                      <label>
                        <input type="checkbox" id="checkApt${numOfApartments}"  />
                        <span>
                          ${apt.city+" "+apt.street}
                          <p id="closeApt${numOfApartments}" style="display: none;">${doc.id}</p>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
            </p>
          `;
          numOfApartments++;
      }
    })
    html +=`
      <p id="numOfAprt" style="display: none;">${numOfApartments}</p>
    `;
  }
  html += `</div>`;
  createForm.innerHTML = html;

}
