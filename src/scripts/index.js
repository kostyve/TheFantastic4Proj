/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
  //M is materialize library, propery Modal, we init it will all our modals
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  //same just with the collaprsibles eg the apartments
  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
//ref to the dom though the class
const aptList = document.querySelector('.apartments');

//setup guides
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
          <div class="collapsible-header grey lighten-4">${apt.title}</div>
          <div class="collapsible-body white">${apt.content}.</div>
        </li>
      `;
      html += li;
      //now what will happen above ^ is that, the code will be appended to itself in a chain
      // so lets say if we run this 3 times in the data loop there will be 3 sets of li
    });
    aptList.innerHTML = html; // here were taking all our code created and outputting it to the dom
  }else{
    aptList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
  }

};
