

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        //get data only if the user logged in
        db.collection('apartments').get().then(snapshot => {
            setupApts(snapshot.docs);
        });
    }else{
        //we hide the data so when were not logged in, essentially no data is shown
        setupApts([]);
    }
});


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
        //were taking the credention and log it
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();

    });
});

//log out method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    //async logout
    auth.signOut();
});

//loginuser
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info NOTE they have their own scopes
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
    
        //close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})