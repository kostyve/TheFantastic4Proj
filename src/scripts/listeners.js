/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

//add admin cloud functions reference so that we could make someone an admin
const adminForm = document.querySelector('.admin-actions');

/* CREATION OF A NEW APARTMENTF FROM THE FORM
creation of a new form using the query selector to find createform class
using a listener we listen for 'submit' and when we receive the eVENT obj, we prevent the
default page refresh */
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //example how to pull user data. first we get data from firebase auth
    var user = auth.currentUser;
    
    let reviews=[{
        studentId:"reviewZero",
        rating:3,
        revMsg:"zero"
    }];

    let imgURL=[""];

    //we add apartment to the collection by adding an object which looks like {address: '', description: ''}
    addAptFromForm(reviews, user.uid, imgURL);
});

//SIGNUP FORM - CREATING OF A NEW USER (signup and then login user)
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    //prevent refresh
    e.preventDefault();

    //get user info, we can use the fields using square bracket notation with the id in''
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const fName = signupForm['signup-firstname'].value;
    const lName = signupForm['signup-familyname'].value;
    const bDate = signupForm['bday'].value;
    const isLandLord = signupForm['land-lord'].checked;

    /* sign up the user
    this task is async, so were going to have to deal
    a promise with .then().    cred is when a user created, you get their credentials back
    which is used to create a new firestore (db) document*/
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //were going to return a promise which is the access to db, and we go to 'users'
        //colection, so when we try to create something that doesnt exist yet, google creates
        //auto uid for the document *THIS MAY CHANGE IN THE FUTURE*
        return db.collection('users').doc(cred.user.uid).set({
            email: email,
            firstName: fName,
            familyName: lName,
            birthDate: bDate,
            imgUrl:"",
            LandLord:isLandLord
        });
        // now after the entry is created with the unique user id which is going inside the collection
        // and we finally when the db entry is done, we clear our form and reset it for further use
    }).then(() => {
      //after user signup if he mark the "i am landlord", then make him landlord(admin).
        if(isLandLord){
          //we create a reference of the function named addAdminRole thorugh the callable as we created in functions/index.js
            addAdministrationPermissions(email);
        //   const addAdminRole = functions.httpsCallable('addAdminRole');
        //   //this is how we call it, that adminEmail represents the 'data' in the cloud functions
        //     addAdminRole({email: email}).then(result => {
        //         const modal = document.querySelector('#modal-landlord');
        //         M.Modal.getInstance(modal).close();
        //         adminForm.reset();
        //     }).then(() => {
        //         alert("Its going to take a few moments to set up your permission to add apartments, please relogin.");
        //         const modal = document.querySelector('#modal-signup');
        //         M.Modal.getInstance(modal).close();
        //         signupForm.reset();
        //         signupForm.querySelector('.error').innerHTML = '';
        //         location.reload();

        //     }).catch(error => {
        //         signupForm.querySelector('.error').innerHTML = error.message;
        //     });
      }else{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
        location.reload();
      }
      //auth.signOut();

    }).catch(error => {
        signupForm.querySelector('.error').innerHTML = error.message;
    });
});

function addAdministrationPermissions(em){
    const addAdminRole = functions.httpsCallable('addAdminRole');
          //this is how we call it, that adminEmail represents the 'data' in the cloud functions
        addAdminRole({email: em}).then(result => {
            const modal = document.querySelector('#modal-landlord');
            M.Modal.getInstance(modal).close();
            adminForm.reset();
        }).then(() => {
            alert("Its going to take a few moments to set up your permission to add apartments, please relogin.");
            const modal = document.querySelector('#modal-signup');
            M.Modal.getInstance(modal).close();
            signupForm.reset();
            signupForm.querySelector('.error').innerHTML = '';
            location.reload();

        }).catch(error => {
            signupForm.querySelector('.error').innerHTML = error.message;
        });
}

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

//make a ref for the attration form in the nav bar.
const attractionsForm = document.querySelector('#attraction-form');
attractionsForm.addEventListener('submit', (e) =>{
  e.preventDefault();

  let proximityApt=[];
  const numOfAprtments = document.getElementById('numOfAprt').textContent;
  let aptRadioButton;
  let aptId;
  for (var i = 0; i < numOfAprtments; i++) {
    aptRadioButto = attractionsForm['checkApt'+i].checked;
    aptId = document.getElementById('closeApt'+i).textContent;

    if(aptRadioButto==true){
      proximityApt.push(aptId);
    }
  }
  db.collection('attractions').add({
      //with square brackets we get the content of the fields in the form in index.html.
      //better to use this rather than . notation because they dont work with hyphen text
      city: attractionsForm['city'].value,
      street: attractionsForm['street'].value,
      name: attractionsForm['name'].value,
      description: attractionsForm['description'].value,
      phone: attractionsForm['phone'].value,
      proximity: proximityApt
      // this is going to store an entry into our db, which works as asynch method !
  }).then((docRef) => {
    //we will addimagesforthe attraction
    attractionImgUpload(docRef);
    
      // when it returns the promise we want to reset the form and close the modal
      const modal = document.querySelector('#modal-attraction');
      M.Modal.getInstance(modal).close();
      attractionsForm.reset();
      //HERE important thing happens here. we get the authentication method error because were not authenticated
      //now we want to catch it so we could show a different message
  }).catch(err => {
      console.log(err.message)
  });

});

function attractionImgUpload(docRef){
    const selectedFile = document.getElementById('uploadAttractionImgButton').files[0];
      if(selectedFile){
        var storageRef = cloudStorage.ref('attractions/' + docRef.id + '/' + selectedFile.name);
        sendTask(storageRef, selectedFile, docRef.id, 'attractions');
      }
}

function sendTask(storageRef, selectedFile, id, collection){
    //will get storage reference and then create a task to upload the file
    var task = storageRef.put(selectedFile);
        task.on('state_changed',
          function progress(snapshot){
              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              uploader.style.width = percentage +'%';
          },
          function error(err){
            console.log(err)
          },
          function complete(){
            task.snapshot.ref.getDownloadURL().then(downloadURL => {
              db.collection(collection).doc(id).update({
                imgURL: downloadURL
              }).then(()=>{
              }).catch(err => {
                console.log(err.messege)
              });
            });
          });
}
