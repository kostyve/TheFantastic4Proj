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
      <div>${doc.data().firstName}</div>
      <div class="green-text">${user.admin ? 'Admin' : ''}</div>
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
const setupApts = (data, isAdmin, searchWord="") => {
  //check len on the data, if we have no length then user is not logged in. we show different data
  if (data.length){
      //we need to create a template and run through our data and input it inside
    let html = '';

    data.forEach(doc => {
      const apt = doc.data();

      if(apt.city.includes(searchWord) || apt.street.includes(searchWord)){

      // we summ our const li templates appending each cycle
      const li = readApartments(doc.id, apt,isAdmin);

      // TODO:'*****'must setup here the proper function for stars. this is just for visualization
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
      //(search engine)check if searchWord is part of the aprtment city name.

      if(user.uid==apt.ownerId){
        countTotalApt++;
        if(apt.rented==true){
          countTotalRentedApt++;
          totalIncome += Number(apt.price);
        }
      }
      const li = readApartments(doc.id ,apt, isAdmin, user.uid, true);
      apartmentsList += li;

    });

    //if the user is admin show the currect information(owned apartments and incomes) in the dashboard
    if(isAdmin){
      console.log("info: "+countTotalApt+", "+totalIncome);
    html += `
            <li>
              ${"<h6><b>Total rented apartments:</b> "+countTotalRentedApt+"</h6>"}
              ${"<h6><b>Avarage income:</b> "+totalIncome/countTotalRentedApt+"</h6>"}
              ${"<h6><b>Total income:</b> "+totalIncome+"</h6>"}
              ${"<h6><b>Total owned apartments:</b> "+countTotalApt+"</h6>"}
            </li>
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

function readApartments(aptId, apt, isAdmin = false,id = apt.ownerId, forDashBoard=false){
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
        <div class="collapsible-header grey lighten-4">${apt.city+" "+apt.street}
            <i class="right small material-icons grey-text right">
    `;

    //collec all the apartments reviews to one collection(as string).

    let totalRating = 0;
    let collectReviws="";
    let rev="";
    let i,j,z;
    if(apt.reviews[0]==""){
      collectReviws+="<b><p>This apartment have no rviews.</b></p>";
    }else{

      totalRating=apt.reviews.length;
      for(j=0;j<apt.reviews.length;j++){
        rev=apt.reviews[j];
        totalRating+=Number(rev.rating);
        collectReviws+="<b><p>"+"["+j+"]"+"Review rating:"+"</b>"+rev.rating+"</p>";
        collectReviws+="<p>"+rev.revMsg+"</p>";
      }
    }
    //console.log(pt.reviews.length);
    console.log((Array.isArray(apt.reviews) && apt.reviews.length)==1);

    if((Array.isArray(apt.reviews) && apt.reviews.length)==1){

      li+=`star_borderstar_borderstar_borderstar_borderstar_border`;

    }else {
      console.log("work B");
      for(i=0;i<(totalRating/apt.reviews.length);i++){
      li+=`stars`;
      }
      for(i=0;i<5-(totalRating/apt.reviews.length);i++){
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
        </div>
        <div class="collapsible-body white">
        ${"<b>description:</b> "+apt.description}
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
        //<a class="waves-effect waves-light btn">button</a>

        li +=  `
        <div><a class="waves-effect green btn" onclick="Confirmation(${"'"+aptId+"'"})">press to order</a></div>
        `;
      }
    }
    //TODO: review scroll.
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
      rentAprt(aptId)
    }
  alert(txt);
  }
}

function rentAprt(aptId, unRent=false){
  //update the apartment by aptId.
  db.collection('apartments').doc(aptId).update({
    studentId: unRent?"":user.uid,
    studentName: unRent?"":user.email,
    rented: unRent?false:true
  }).then(()=>{
    console.log("aprtment updated.");
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
        console.log('No such document!');
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
    console.log("aprtment updated.");
  }).catch(err => {
    console.log(err.message);
  });
}

function addReview(aptId){
  let getDoc = db.collection('apartments').doc(aptId).get().then(doc => {
      let apt;
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        apt = doc.data();
        console.log(apt);

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
     console.log("is emty");
    reviews[0]=rev;
  }else {
    console.log("is not! emty: "+reviews.length+"\n"+ apt.reviews);
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
  alert("We added your review. \nthnks for your time.");
}).catch(err => {
  console.log('Error getting document', err);
});
}

function experimentalFunction(data=""){
  //function for testing.... will be deleted later..
  //let testString="starting:\n";
  //const apt = db.collection('apartments').doc("OGqYOFoudZ1Ctk6jLMKJ").get().then(doc => {});
    let getDoc = db.collection('apartments').doc("7QT3TdSU4cYgfLMpavUE").get().then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data().reviews.length);
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  alert("test");

}
