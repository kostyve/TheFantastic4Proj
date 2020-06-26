/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */



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



//function for adding the apartment, refactor for sumbit event listener for creating apt
function addAptFromForm(reviews, uid, imgURL){
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
}

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
db.collection('attractions').onSnapshot(snapshot => {
  setEditForm(snapshot.docs);

  editForm.addEventListener('submit', (e) =>{
      e.preventDefault();
      //example how to pull user data. first we get data from firebase auth
      //var user = auth.currentUser;
      const aptId = document.getElementById('apt-id').textContent;

      const aptINDict = {
        INcity: editForm['city'].value,
        INstreet: editForm['street'].value,
        INfloor: editForm['floor'].value,
        INdescription: editForm['description'].value,
        INzip: editForm['zip'].value,
        INprice: editForm['price'].value,
        INdiscount: editForm['discount'].value
      };
 
      updateApartment(aptId, aptINDict);

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

function updateApartment(aptId, dict){
  //this function apdate the apartments, only the apartment id.
  //all the rest have default value if not given any.
  let apt;

  db.collection('apartments').doc(aptId).get().then(doc => {
    if (!doc.exists) {
      console.log('error, cannot find document');
    } else {
      apt = doc.data();
    }

    updateAptDoc(apt, aptId, dict)

  }).then(() => {
      // when it returns the promise we want to reset the form and close the modal
      const modal = document.querySelector('#modal-edit');
      M.Modal.getInstance(modal).close();
      editForm.reset();
  }).catch(err => {
      console.log(err.message);
});
}

function updateAptDoc(apt, aptId, INdict){
  db.collection('apartments').doc(aptId).update({
    //if the INcoming is empty(equal to "") then change nothing.
    city: INdict['INcity']==="" ? apt.city : INdict['INcity'],
    street: INdict['INstreet']==="" ? apt.street : INdict['INstreet'],
    floor: INdict['INfloor']==="" ? apt.floor : INdict['INfloor'],
    description: INdict['INdescription']==="" ? apt.description : INdict['INdescription'],
    zip: INdict['INzip']==="" ? apt.zip : INdict['INzip'],
    price: INdict['INprice']==="" ? apt.price : INdict['INprice'],
    discount: INdict['INdiscount']==="" ? apt.discount : INdict['INdiscount']
  }).then(()=>{
  }).catch(err => {
    console.log(err.message);
  });
}
//end of file