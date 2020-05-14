/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//ref to the dom though the class name, which is : class="collapsible z-depth-0 apartments"
const apartmentList = document.querySelector('.apartments');

//ref to the logged out class so that we could implement button hiding when user is logged in/out
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
//ref to the logged in accout
const accountDetails = document.querySelector('.account-details');
//make a ref for admin items, most likely it will be set to landlord
const adminItems = document.querySelectorAll('.admin');

/* CONDITIONAL MENU LINKS we setup UI elements according to:
 will get a user as a parameter, and inside we want to check
 if the user exists or not and we will show or hide the links accordingly*/
const setupUI = (user) => {
  //toggle UI elements
  if (user) {
    // check if he has admin token if so, then present all the admin items
    if(user.admin){
      adminItems.forEach(item => item.style.display = 'block');
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
});

//setup apartments
const setupApts = (data) => {
  //check len on the data, if we have no length then user is not logged in. we show different data
  if (data.length){
      //we need to create a template and run through our data and input it inside
    let html = '';
    data.forEach(doc => {
      const apt = doc.data();
      
      // we summ our const li templates appending each cycle
      const li =readApartments(apt)
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

function readApartments(apt){
  //function for gettin list of apartments based on user id. This function populates setupApts with data
  //a template whic is dynamically constructed
  //backticks used in js to create template string. ${} is a placeholder
  const li= `
    <li>
      <div class="collapsible-header grey lighten-4">${apt.city+" "+apt.street}
          <i class="right small material-icons grey-text right">
            star_border star_border star_border star_border star_border
          </i>
      </div>
      <div class="collapsible-body white">${"<b>description:</b> "+apt.description}.</div>
      <div class="collapsible-body white">${"<b>Floor:</b> "+apt.floor}.</div>
      <div class="collapsible-body white">${"<b>Zip code:</b> "+apt.zip}.</div>
      <div class="collapsible-body white">${"<b>Price:</b> "+apt.price}.</div>
      <div class="collapsible-body white"><button onclick="Confirmation()">Connect to landlord</button></div>
    </li>
  `;
  return li
}
function Confirmation(){
  alert("The transaction was successful.Immediately the landlord will contact you soon Thanks.");
}