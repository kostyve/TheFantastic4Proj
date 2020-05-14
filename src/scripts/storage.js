/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
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
      uploader.value = percentage;
  },
  function error(err){
    console.log(err)
  },
  
  function complete(){
    var user = auth.currentUser;
    console.log(user.uid)
    //create the data we need
    console.log('upload complete')
   
    //update user db to include the url to the uploaded photo

    //update user profile to verified

    //give user permissions to order an apartment*/
    console.log('upload complete')
  }
  
);
})