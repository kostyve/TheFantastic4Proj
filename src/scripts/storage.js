/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

var uploader = document.getElementById('uploader');

//listen for file selection

<<<<<<< Updated upstream
fileButton.addEventListener('change', function(e) {
=======
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
>>>>>>> Stashed changes

var file = e.target.files[0];
var userId ='';
//sketchy try catch doesnt work
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
  var user = auth.currentUser;
  console.log('Upload finished')
  alert("Uploaded successfully!");
  //create the data we need
  
  //update user db to include the url to the uploaded photo

  //update user profile to verified

<<<<<<< Updated upstream
  //give user permissions to order an apartment*/
}

);
})
=======
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
>>>>>>> Stashed changes
