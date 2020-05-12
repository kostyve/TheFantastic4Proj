/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//listen for auth status changes login and logout
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user.email);
        //get data only if the user logged in
        db.collection('apartments').get().then(snapshot => {
            setupApts(snapshot.docs);
            //here we call setup ui with user so it will eval true = will show ui
            setupUI(user);
        });
    }else{
        //we hide the data so when were not logged in, essentially no data is shown
        console.log('user is not logged in');
        //call with no user , hence evaluate to false = wont show ui
        setupUI();
        setupApts([]);
    }
});


/* CREATION OF A NEW APARTMENTF FROM THE FORM
    creation of a new form using the query selector to find createform class
    using a listener we listen for 'submit' and when we receive the eVENT obj, we prevent the 
    default page refresh */
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //we add apartment to the collection by adding an object which looks like {address: '', description: ''}
    db.collection('apartments').add({
        //with square brackets we get the content of the fields in the form in index.html.
        //better to use this rather than . notation because they dont work with hyphen text
        title: createForm['address'].value,
        description: createForm['description'].value
        // this is going to store an entry into our db, which works as asynch method !
    }).then(() => {
        // when it returns the promise we want to reset the form and close the modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
        //HERE important thing happens here. we get the authentication method error because were not authenticated
        //now we want to catch it so we could show a different message
    }).catch(err => {
        console.log(err.message)
    })
})


//signup and login user
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    //preven refresh
    e.preventDefault();

    //get user info, we can use the fields using square bracket notation with the id in''
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user this task is async, so were going to have to deal a promise with .then()
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //were taking the credential and doing nothing with it
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();

    });
});


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
    })
})