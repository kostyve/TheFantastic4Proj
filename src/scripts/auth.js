/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//add admin cloud functions reference so that we could make someone an admin
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    //we create a reference of the function named addAdminRole thorugh the callable as we created in functions/index.js
    const addAdminRole = functions.httpsCallable('addAdminRole');
    //this is how we call it, that adminEmail represents the 'data' in the cloud functions
    addAdminRole({email: adminEmail}).then(result => {
        console.log(result);
    });
});
//listen for auth status changes login and logout added method to check if a user is an admin
auth.onAuthStateChanged(user => {
    if (user) {
        //we want to check the calaims if a user is admin if he is we will add the token to the user
        user.getIdTokenResult().then(idTokenResult =>{
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });
        //TODO: remove this console log when project is finalized
        console.log('user logged in: ', user.email);
        //get data through snapshot, but we changed here to
        // onSnapshot() so that our db will update realtime!! that easy
        db.collection('apartments').onSnapshot(snapshot => {
            user.getIdTokenResult().then(idTokenResult =>{
              //to know if the person that ask for apartments is an admin or not.
            getMyOwnAprts(snapshot.docs, idTokenResult.claims.admin);
            setupApts(snapshot.docs, idTokenResult.claims.admin);
            });
            //here we call setup ui with user so it will eval true = will show ui
        }, error =>{
            //this is how to handle error on listeners, that is the onSnapshot!
            console.log(error.message)
        });
    }else{
        //we hide the data so when were not logged in, essentially no data is shown
        console.log('user is not logged in');
        //call with no user , hence evaluate to false = wont show ui
        setupUI();
        setupApts([]);
        getMyOwnAprts([]);
    }
});


/* CREATION OF A NEW APARTMENTF FROM THE FORM
    creation of a new form using the query selector to find createform class
    using a listener we listen for 'submit' and when we receive the eVENT obj, we prevent the
    default page refresh */
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //example how to pull user data. first we get data from firebase auth
    var user = auth.currentUser;
    //create the data we need
    var name, email, uid;
    if (user != null){
        name = user.displayName;
        email= user.email;
        uid = user.uid;
    }
    console.log(uid,name,email)
    //we add apartment to the collection by adding an object which looks like {address: '', description: ''}
    db.collection('apartments').add({
        //with square brackets we get the content of the fields in the form in index.html.
        //better to use this rather than . notation because they dont work with hyphen text
        city: createForm['city'].value,
        street: createForm['street'].value,
        floor: createForm['floor'].value,
        description: createForm['description'].value,
        zip: createForm['zip'].value,
        price: createForm['price'].value,
        ownerId: uid,
        //attributes to help recognize buyer.
        studentId: '',
        studentName: '',
        rented: false

        // this is going to store an entry into our db, which works as asynch method !
    }).then(() => {
        // when it returns the promise we want to reset the form and close the modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
        //HERE important thing happens here. we get the authentication method error because were not authenticated
        //now we want to catch it so we could show a different message
    }).catch(err => {
<<<<<<< Updated upstream
        console.log(err.message)
    })
=======
        console.log(err.message);
    });
>>>>>>> Stashed changes
})


//SIGNUP FORM - CREATING OF A NEW USER (signup and then login user)
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    //prevent refresh
    e.preventDefault();

    //get user info, we can use the fields using square bracket notation with the id in''
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    /* sign up the user
    this task is async, so were going to have to deal
    a promise with .then().    cred is when a user created, you get their credentials back
    which is used to create a new firestore (db) document*/
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //were going to return a promise which is the access to db, and we go to 'users'
        //colection, so when we try to create something that doesnt exist yet, google creates
        //auto uid for the document *THIS MAY CHANGE IN THE FUTURE*
        return db.collection('users').doc(cred.user.uid).set({
            firstName: signupForm['signup-firstname'].value,
            isVerified: false
        });
        // now after the entry is created with the unique user id which is going inside the collection
        // and we finally when the db entry is done, we clear our form and reset it for further use
    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
        signupForm.querySelector('.error').innerHTML = error.message;
    });
})


//logout/signout method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    //async logout
    auth.signOut();
});


//login user through submit
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info. *NOTE: they have their own scopesand thats why we can use email and pass again
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
        loginForm.querySelector('.error').innerHTML = error.message;
});
})
<<<<<<< Updated upstream
=======

//User deletion with the auth firebase NOTE: THIS FUNCTION WILL WORK ONLY IF A USER IS SIGNED RECENTLY
//OTHERWISE YOU NEED TO RE-AUTHENTICATE, SEE DETAILS IN THE FIREBASE DOCUMENTATION
function userAccountDelete(){
    // using delete will return a promise, and it will activate the onDelete function in the firebase.functions
    var user = auth.currentUser;
    user.delete().then(() => {

        //user deleted
    }).catch(err => {

        //some error happened
    });
}

//make a ref for the edit form in the admin DASHBOARD.
const editForm = document.querySelector('#edit-form');
editForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //example how to pull user data. first we get data from firebase auth
    //var user = auth.currentUser;
    const aptId = document.getElementById('apt-id').textContent;
    const aptCity = editForm['city'].value;
    const aptStreet = editForm['street'].value;
    const aptFloor = editForm['floor'].value;
    const aptDesc = editForm['description'].value;
    const aptZip = editForm['zip'].value;
    const aptPrice = editForm['price'].value;

    updateApartment(aptId, aptCity, aptStreet, aptFloor, aptDesc, aptZip, aptPrice);

    }).catch(err => {
      console.log(err.message);
});

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

    db.collection('apartments').doc(aptId).update({
      //if the INcoming is empty(equal to "") then change nothing.
      city: (INcity=="")?(apt.city):(INcity),
      street: INstreet==""?apt.street:INstreet,
      floor: INfloor==""?apt.floor:INfloor,
      description: INdescription==""?apt.description:INdescription,
      zip: INzip==""?apt.zip:INzip,
      price: INprice==""?apt.price:INprice,

    }).then(()=>{
    }).catch(err => {
      console.log(err.message);
    });
  }).then(() => {
      // when it returns the promise we want to reset the form and close the modal
      const modal = document.querySelector('#modal-edit');
      M.Modal.getInstance(modal).close();
      editForm.reset();
      //HERE important thing happens here. we get the authentication method error because were not authenticated
      //now we want to catch it so we could show a different message
  }).catch(err => {
      console.log(err.message);
});
};
>>>>>>> Stashed changes
