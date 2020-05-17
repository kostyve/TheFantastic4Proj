/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

var uploader = document.getElementById('uploader');

//listen for file selection

fileButton.addEventListener('change', function(e) {

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
  
  console.log('Upload finished')
  //Create a reference under which you want to list
  //create full path for the url
  storageRef.getMetadata().then(metadata => {
    console.log(metadata.fullPath);
    db.collection('users').doc(userId).update({
      imgUrl: metadata.fullPath
    }).then(() => {
      console.log('metadata deployed');
    }).catch(err => {
      console.log(err.messege);
    })
  })
  
  db.collection('users').doc(userId).update({
    isVerified: true
  }).then(()=>{
      console.log('verified student')
  }).catch(err => {
    console.log(err.messege)
  })
  alert("Uploaded successfully!");
  //create the data we need
  
  //update user db to include the url to the uploaded photo

  //update user profile to verified

  //give user permissions to order an apartment*/
}

);
})