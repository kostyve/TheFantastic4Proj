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
      <div>${doc.data().firstName}</div>
      <div class="green-text">${user.admin ? 'Admin' : ''}</div>
      `;
      // get the account-details class of the inner html
      accountDetails.innerHTML = html;
    });

    // display = block means to show the items, where as none is to hide them
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  }else{
    //hide admin items
    adminItems.forEach(item => item.style.display = 'none');

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
  M.Datepicker.init(elems,Option);

});


//setup apartments
const setupApts = (data, isAdmin) => {
  //check len on the data, if we have no length then user is not logged in. we show different data
  if (data.length){
      //we need to create a template and run through our data and input it inside
    let html = '';

    data.forEach(doc => {

      const apt = doc.data();
      // we summ our const li templates appending each cycle
      const li = readApartments(apt,isAdmin);

      // TODO:'*****'must setup here the proper function for stars. this is just for visualization
      html += li;
      // so lets say if we run this 3 times in the data loop there will be 3 sets of li

    });


    apartmentList.innerHTML = html; // here were taking all our code created and outputting it to the dom
      // that is, in our container mentioned above in the head of this file
  }else{
    apartmentList.innerHTML = '<h5 class="center-align">Login to view available apartments</h5>';
  }

};

const getMyOwnAprts = (data, isAdmin=false) => {
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
      if(user.uid==apt.ownerId){
        countTotalApt++;
        if(apt.rented==true){
          countTotalRentedApt++;
          totalIncome += apt.price;
        }
      }

      const li = readApartments(apt, isAdmin, user.uid);
      apartmentsList += li;
    });

    html += `
            <li>
              ${"<h6><b>Total rented apartments:</b> "+countTotalRentedApt+"</h6>"}
              ${"<h6><b>Avarage income:</b> "+totalIncome/countTotalApt+"</h6>"}
              ${"<h6><b>Total income:</b> "+totalIncome+"</h6>"}
              ${"<h6><b>Total owned apartments:</b> "+countTotalApt+"</h6>"}
            </li>
            `;
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

function readApartments(apt, isAdmin = false,id = apt.ownerId){
  //function for gettin list of apartments based on user id. This function populates setupApts with data
  //a template whic is dynamically constructed
  //backticks used in js to create template string. ${} is a placeholder
  let li=``;

  if(id==apt.ownerId){
    li= `
      <li>
        <div class="collapsible-header grey lighten-4">${apt.city+" "+apt.street}
            <i class="right small material-icons grey-text right">
<<<<<<< Updated upstream
              star_border star_border star_border star_border star_border
            </i>
=======
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
    //for the thing that the collapsible open(that board thing).
    li+=`
>>>>>>> Stashed changes
        </div>
        <div class="collapsible-body white">${"<b>description:</b> "+apt.description}</div>
        <div class="collapsible-body white">${"<b>Floor:</b> "+apt.floor}</div>
        <div class="collapsible-body white">${"<b>Zip code:</b> "+apt.zip}</div>
        <div class="collapsible-body white">${"<b>Price:</b> "+apt.price}</div>
    `;

    if(apt.rented==true){
      li +=  `<div class="collapsible-body white">${"<b>Rented:</b> Yes"}</div>`;
      if(isAdmin==true){
        //if the user is admin->show the name of the person that rent the aprtment(relevent to the dashboard).
        li +=  `<div class="collapsible-body white">${"<b>student name:</b> "+apt.studentName}</div>`;
      }
    }else{
      if(isAdmin==false){
        //admin cant buy apartment, and no one can buy rented apartment.
<<<<<<< Updated upstream
        li +=  `<div class="collapsible-body white"><button onclick="Confirmation()">press to order</button></div>`;
=======
        li +=  `
        <div><a class="waves-effect green btn" onclick="Confirmation(${"'"+aptId+"'"})">press to order</a></div>
        `;
      }else if(forDashBoard == true){
        /*li +=  `
        <div><a class="waves-effect green btn" onclick="editFormFunc(${"'"+aptId+"'"})">Edit</a></div>
        `;*/
        li +=  `
        <a href="#" class="waves-effect green btn modal-trigger" data-target="modal-edit" onclick="editFormFunc(${"'"+aptId+"'"})">Edit</a>
        `;
>>>>>>> Stashed changes
      }
      li +=  `<div class="collapsible-body white">${"<b>Rented:</b> no"}</div>`;
    }
<<<<<<< Updated upstream
=======

      li+=`
      <div><h5><b>Reviews:</b></h5></div>
      `;


      //add the collection of reviews msgs here.
      li+=`
      <div style=": background-color: lightblue; width: 500px; height: 150px; overflow: scroll;">
      ${collectReviws}
      </div>
      `;
>>>>>>> Stashed changes

    li+= `</li>`;
  }
  return li
}

<<<<<<< Updated upstream
function Confirmation(){
  alert("The transaction was successful.Immediately the landlord will contact you soon Thanks.");
=======
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
  today = yyyy+"-"+mm+"-"dd;
  db.collection('orders').add({
    aptId: aptId,
    cardId: creditCardId,
    studentId: auth.currentUser.uid,
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
>>>>>>> Stashed changes
}

function editFormFunc(aptId){
  //help pass the apartment id to the editForm section in the auth.js .
   document.getElementById('apt-id').textContent=aptId;
}
