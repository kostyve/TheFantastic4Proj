/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

var uploader = document.getElementById('uploader');
//selecting an img ref
var imgItem = document.querySelector('.upload-pic');

var aptUploader = document.getElementById('apartmentUploader')

//populate the image with the url link
auth.onAuthStateChanged( user => {
  if (user){
    db.collection('users').doc(user.uid).get().then((doc) =>{
      //console.log(doc.data());
      imgItem.src = doc.data().imgUrl
    })
  }
})
  



//listen for file selection for ID upload
uploadIdButton.addEventListener('change', function(e) {

  var file = e.target.files[0];
  var userId ='';
  //sketchy
  try{userId = auth.currentUser.uid}catch(err){console.log(err.code)}
  var imgPath = 'img/' + userId;

  var storageRef = cloudStorage.ref(imgPath + '/' + file.name);

  var task = storageRef.put(file);

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
      db.collection('users').doc(userId).update({
        isVerified: true,
        imgUrl: downloadURL
      }).then(()=>{
          console.log('verified student', userId);
          alert("Uploaded successfully!");
          const modal = document.querySelector('#modal-upload');
            M.Modal.getInstance(modal).close();
      }).catch(err => {
        console.log(err.messege)
      });
    });
  });
})


//listen for file selection for apartment upload
uploadImgButton.addEventListener('change', function(e) {

  var file = e.target.files[0];
  var userId ='';
  //sketchy
  try{userId = auth.currentUser.uid}catch(err){console.log(err.code)}
  var imgPath = 'img/' + userId;

  var storageRef = cloudStorage.ref(imgPath + '/' + file.name);

  var task = storageRef.put(file);

  task.on('state_changed',

  function progress(snapshot){
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      aptUploader.style.width = percentage +'%';
  },
  function error(err){
    console.log(err)
  },

  function complete(){
    task.snapshot.ref.getDownloadURL().then(downloadURL => {
      console.log('File available at:' , downloadURL)
      db.collection('users').doc(userId).update({
        isVerified: true,
        imgUrl: downloadURL
      }).then(()=>{
          //TODO need to design this method properly.
          //here we need to assign the apartment images to the apt but the apt is not yet created.
          //so we need to implement it in one of three ways: Extra writes, first save imgs then rewrite them
          //                                                 Add images after apartment creation
          //                                                 call func during the db entry creation
      }).catch(err => {
        console.log(err.messege)
      });
    });
    
    alert("Uploaded successfully!");

  });
})