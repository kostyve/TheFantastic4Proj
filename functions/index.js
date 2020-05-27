//make the google functions service import
const functions = require('firebase-functions');
// create an admin appearence
const admin = require('firebase-admin')
//initialize it just like we did with firebaser app
admin.initializeApp();


// we want to create a function that gives someone admin role
// how we do this>? first we add them to the exports function. it will be https func with option to call from the front end
//data is goin to inclue any data, like email of the user. context is the authenticataion of the user
exports.addAdminRole = functions.https.onCall((data, context) => {
    //check request is made by an admin
    console.log(context.auth.token);
    // if(context.auth.token.admin !== true) {
        // return {error: 'only admins can add other admins, sucker'}
    // }
    //get user and add custom clain (admin)
    // will return this promise over a value because some1 somewhere will call this func to get the value
    return admin.auth().getUserByEmail(data.email).then(user => {
       // so here were returning the user claim with the first user auth val and admin true as an objext
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
        //after were done with that we would want to return an object to the user
    }).then(() => {
        return {
            message: `Success! ${data.email} has been made an Landlord.`
        }
    }).catch(error =>{
        return error;
    });
});


//trigger for new user creation, this will create email and rated apt
exports.newUserSignup = functions.auth.user().onCreate(user => {
    console.log('user created ', user.email, user.uid);
    //for backgroud triggers you must return a value/promise
    return admin.firestore().collection('users').doc(user.uid).update({
        email: user.email,
        ratedApt: []
    });
});

//TODO fill the data so that on user deletion it will wipe all users data, rather only the user doc
//trigger for user deletion
exports.userDeleted = functions.auth.user().onDelete(user => {
    console.log('user deleted ', user.email, user.uid);
    //for backgroud triggers you must return a value/promise
    const doc = admin.firestore().collection('users').doc(user.uid);
    
    //which returns a promise and explicitly deletes user from the users
    return doc.delete();
});

// http callable function (adding a rating)
//data is the data we send to the function from the frontend
//the context has the auth state and useful info
exports.createReview = functions.https.onCall((data, context) => {
    //only if the user is not logged in
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'only authenticated users can add ratings'
        );
    }
    if (data.text.length > 50){
        throw new functions.https.HttpsError(
            'invalid-argument', 
            'rating cannot be longer than 50 characters'
        );
    }

    return admin.firestore().collection('ratings').add({
        rewiewMsg: data.text,
        rating: 0
    });
});