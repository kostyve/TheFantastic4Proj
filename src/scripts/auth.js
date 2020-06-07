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
        const modal = document.querySelector('#modal-landlord');
        M.Modal.getInstance(modal).close();
        adminForm.reset();
    });

});
//listen for auth status changes login and logout added method to check if a user is an admin
auth.onAuthStateChanged(user => {
    if (user) {
        //we want to check the calaims if a user is admin if he is we will add the token to the user
        user.getIdTokenResult().then(idTokenResult =>{
            user.admin = idTokenResult.claims.admin;
            setupUI(user);

        //get data through snapshot, but we changed here to
        // onSnapshot() so that our db will update realtime!! that easy
        db.collection('apartments').onSnapshot(snapshotApar => {
          db.collection('attractions').onSnapshot(snapshotAttr => {

            //to know if the person that ask for apartments is an admin or not.
            getMyOwnAprts(snapshotAttr.docs, snapshotApar.docs, idTokenResult.claims.admin);
            //show as default all the apartments in the database.
            setupApts(snapshotAttr.docs, snapshotApar.docs, user.admin);

            setAtractionForm(snapshotApar.docs);
            //here we call setup ui with user so it will eval true = will show ui

            //grab the search div class from the html.
            const searchEngine = document.querySelector('.search-engine');
              searchEngine.addEventListener('submit', (e) => {
                e.preventDefault();
                db.collection('apartments').onSnapshot(snapshot => {

                  //reconstruct the apartment list to match the searchword.
                  setupApts(snapshotAttr.docs, snapshot.docs, user.admin, document.querySelector('#searchs').value);
              });
            });
          })
        }, error =>{
            //this is how to handle error on listeners, that is the onSnapshot!
            console.log(error.message)
        });



      });
    }else{
        //we hide the data so when were not logged in, essentially no data is shown
        console.log('user is not logged in');
        //call with no user , hence evaluate to false = wont show ui
        setupUI();
        setupApts([]);
        getMyOwnAprts([]);
        setAtractionForm([]);
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

    let reviews=[{
      studentId:"reviewZero",
      rating:3,
      revMsg:"zero"
    }];

    let imgURL=[""];

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
        reviews: reviews,
        ownerId: uid,
        imgURL: imgURL,
        discount: 0,
        //attributes to help recognize buyer.
        studentId: '',
        studentName: '',
        rented: false

        // this is going to store an entry into our db, which works as asynch method !
    }).then((docRef) => {
        console.log('The doc id created is: ' + docRef.id);
        // when it returns the promise we want to reset the form and close the modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
        //HERE important thing happens here. we get the authentication method error because were not authenticated
        //now we want to catch it so we could show a different message
    }).catch(err => {
        console.log(err.message)
    });
})

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

          const addAdminRole = functions.httpsCallable('addAdminRole');
          //this is how we call it, that adminEmail represents the 'data' in the cloud functions
        addAdminRole({email: email}).then(result => {
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
    const selectedFile = document.getElementById('uploadAttractionImgButton').files[0];
      if(selectedFile){
        console.log(selectedFile.name + docRef.id);
        var imgPath = 'attractions/' + docRef.id;
        var storageRef = cloudStorage.ref(imgPath + '/' + selectedFile.name);
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
              console.log('File available at:' , downloadURL)
              db.collection('attractions').doc(docRef.id).update({
                imgURL: downloadURL
              }).then(()=>{
              }).catch(err => {
                console.log(err.messege)
              });
            });
          });
      }
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

//make a ref for the edit form in the admin DASHBOARD.
const editForm = document.querySelector('#edit-form');
db.collection('attractions').onSnapshot(snapshot => {
  setEditForm(snapshot.docs);

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
      const aptdiscount = editForm['discount'].value;

      updateApartment(aptId, aptCity, aptStreet, aptFloor, aptDesc, aptZip, aptPrice, aptdiscount);

      let attractionsIds=[];
      const numOfAttractions = document.getElementById('numOfAttractions').textContent;
      let attrRadioButton;
      let attrId;
      console.log("num of attactions: "+numOfAttractions);
      for (var i = 0; i < numOfAttractions; i++) {
        attrRadioButton = editForm['checkAtrr'+i].checked;
        attrId = document.getElementById('closeAtrr'+i).textContent;

        if(attrRadioButton==true){
          attractionsIds.push(attrId);
        }
      }
      console.log(attractionsIds);
      attractionsIds.forEach(attId => {
        console.log("check1: "+attId+", "+aptId);
        updateAttractionsProximity(attId, aptId);
      });
  })
});

function updateAttractionsProximity(attId, aptId){
  console.log("check2: "+attId+", "+aptId);
  let proximityApt=[]
  //let attraction = doc.data();
  db.collection('attractions').doc(attId).get().then(doc => {
      if (!doc.exists) {
        console.log('error, cannot find document');
      } else {
        attraction = doc.data();
      }

  if(attraction.proximity.includes(aptId) == false){
    proximityApt = attraction.proximity;
    proximityApt.push(aptId);
    db.collection('attractions').doc(attId).update({
      proximity: proximityApt
          // this is going to store an entry into our db, which works as asynch method !
      }).then(() => {
          // when it returns the promise we want to reset the form and close the modal
          const modal = document.querySelector('#modal-attraction');
          M.Modal.getInstance(modal).close();
          attractionsForm.reset();
          //HERE important thing happens here. we get the authentication method error because were not authenticated
          //now we want to catch it so we could show a different message
      }).catch(err => {
          console.log(err.message);
      });
    }else{
      console.log("attraction->"+attId+" alredy connect to apatrment->"+aptId+". [drop update operation]");
    }
  });
}

function updateApartment(aptId, INcity="", INstreet="", INfloor="", INdescription="", INzip="", INprice="", INdiscount=""){
  //this function apdate the apartments, only the apartment id.
  //all the rest have default value if not given any.
  let apt;
  db.collection('apartments').doc(aptId).get().then(doc => {
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
      discount: INdiscount==""?apt.discount:INdiscount
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
}
