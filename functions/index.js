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
    if(context.auth.token.admin !== true) {
        return {error: 'only admins can add other admins, sucker'}
    }
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
            message: `Success! ${data.email} has been made an admin.`
        }
    }).catch(error =>{
        return error;
    });
});