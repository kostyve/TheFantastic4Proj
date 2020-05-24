/* eslint-disable no-undef, no-global-assign, no-unused-vars, no-undef */

var uploader = document.getElementById('uploader');
//selecting an img ref
var imgItem = document.querySelector('.upload-pic');
auth.onAuthStateChanged( user => {
  if (user){
    db.collection('users').doc(user.uid).get().then((doc) =>{
      //console.log(doc.data());
      imgItem.src = doc.data().imgUrl
    })
  }
})
  



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
    task.snapshot.ref.getDownloadURL().then(downloadURL => {
      console.log('File available at:' , downloadURL)
      db.collection('users').doc(userId).update({
        isVerified: true,
        imgUrl: downloadURL
      }).then(()=>{
          console.log('verified student', userId)
      }).catch(err => {
        console.log(err.messege)
      });
    });
    
    alert("Uploaded successfully!");

  });
})