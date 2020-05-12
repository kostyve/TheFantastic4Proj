/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//ref to the dom though the class name, which is : class="collapsible z-depth-0 apartments"
const apartmentList = document.querySelector('.apartments');

//ref to the logged out class so that we could implement button hiding when user is logged in/out
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

/* CONDITIONAL MENU LINKS we setup UI elements according to:
 will get a user as a parameter, and inside we want to check
 if the user exists or not and we will show or hide the links accordingly*/
const setupUI = (user) => {
  //toggle UI elements
  if (user) {
    // display = block means to show the items, where as none is to hide them
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  }else{
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
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
      //backticks used in js to create template string. ${} is a placeholder
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">${apt.street}</div>
          <div class="collapsible-body white">${apt.description}.</div>
        </li>
      `;
      // we summ our const li templates appending each cycle
      html += li;
      // so lets say if we run this 3 times in the data loop there will be 3 sets of li
    });
    apartmentList.innerHTML = html; // here were taking all our code created and outputting it to the dom
      // that is, in our container mentioned above in the head of this file
  }else{
    apartmentList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
  }

};
