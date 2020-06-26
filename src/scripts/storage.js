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
  sendTask(storageRef, file, userId, 'users');
  // var task = storageRef.put(file);

  // task.on('state_changed',

  // function progress(snapshot){
  //     var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     uploader.style.width = percentage +'%';
  // },
  // function error(err){
  //   console.log(err)
  // },

  // function complete(){
  //   task.snapshot.ref.getDownloadURL().then(downloadURL => {
  //     console.log('File available at:' , downloadURL)
  //     db.collection('users').doc(userId).update({
  //       isVerified: true,
  //       imgUrl: downloadURL
  //     }).then(()=>{
  //         console.log('verified student', userId);
  //         alert("Uploaded successfully!");
  //         const modal = document.querySelector('#modal-upload');
  //           M.Modal.getInstance(modal).close();
  //     }).catch(err => {
  //       console.log(err.messege)
  //     });
  //   });
  // });
})

//UPLOADING APARTMENT IMAGES IN THE EDITING MODULE
uploadAptsImgButton.addEventListener('change', function(e) {
  const aptId = document.getElementById('apt-id').textContent;
  var file = e.target.files[0];
  var imgPath = 'apts/' + aptId;
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
    let imgArray = [];
    task.snapshot.ref.getDownloadURL().then(downloadURL => {
      db.collection('apartments').doc(aptId).get().then(doc =>{
        const apt = doc.data();
        imgArray = apt.imgURL;
        imgArray.push(downloadURL);
        db.collection('apartments').doc(aptId).update({
          imgURL: imgArray
        }).then((s)=>{
        }).catch(err => {
          console.log(err.messege)
        });
      })
    });
    
    alert("Uploaded successfully! You can add another image");

  });
})