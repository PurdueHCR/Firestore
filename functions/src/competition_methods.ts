import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import {createSaveSemesterPointsEmail} from "./email_functions/SaveSemesterPointsEmail";
import {createResetHouseCompetitionEmail} from "./email_functions/ResetHouseCompetitionEmail";

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}

const db = admin.firestore();
const comp_app = express();
const cors = require('cors');
const comp_main = express();
const nodemailer = require('nodemailer');
const firestoreTools = require('./firestoreTools');

comp_main.use(comp_app);
comp_main.use(bodyParser.json());
comp_main.use(bodyParser.urlencoded({ extended: false }));



// competition_main is the object to be exported. export this in index.ts
export const competition_main = functions.https.onRequest(comp_main);

//Define keys for database collections
const USERS_KEY = 'Users'
const SYSPREF_KEY = 'SystemPreferences'

//Setup the Sending Email Control
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'purduehcrcontact@gmail.com',
		pass: 'Honors1!'
	}
})

//setup Cors for cross site requests
comp_app.use(cors({origin:true}));
//Setup firestoreTools to validate user has been 
comp_app.use(firestoreTools.validateFirebaseIdToken);



/**
 * Post Function that sends an email to confirm the saving of the semester points
 */
comp_app.post('/save-semester-points', (req, res) => {
	//Get user
	db.collection(USERS_KEY).doc(req["user"]["user_id"]).get()
	.then(async userDocument => {
		if(userDocument.exists ){
			//User exists, then make sure that permission is 2, REC/REA
			const permissionLevel = userDocument.data()!["Permission Level"];
			if(permissionLevel === 2){

				//Generate random key, save it to the house system and create a link 
				const secretKey = randomString(50);
				const path = "https://"+req.hostname+"/competition/secret-semester-points-set?code="+secretKey;
				await db.collection(SYSPREF_KEY).doc("Preferences").update({OneTimeCode: secretKey});

				//Set the mail options
				const mailOptions = {
					from: 'Purdue HCR Contact <purduehcrcontact@gmail.com',
					to: req["user"]["email"],
					subject: "Set Semester Points",
					html: createSaveSemesterPointsEmail(path)
				};

				//Send mail
				transporter.sendMail(mailOptions,  (erro, info) =>{
					if(erro){
						//Could not send email
						return res.status(500).send(erro);
					}
					else{
						return res.status(200).send("Confirmation sent");
					}
				})
			}
			else{
				//User is not an REA/REC
				res.status(409).send("User does not have sufficient permissions to perform this action.");
			}
			
		}
		else{
			//User does not have user data in the database
			res.status(410).send("Undefined User Role");
		}
	})
	//Server error
	.catch(err => res.status(500).send("Failed to retrieve user with error: "+ res));
})

/**
 * Get request; This will be called from an email sent to the rec with the one time use code
 */
comp_app.get('/secret-semester-points-set', (req, res) => {
	//Get user id. Check the house. Get the rank of the user
	db.collection("SystemPreferences").doc("Preferences").get()
				.then(preferenceDocument =>{
					const usersRef =  db.collection(USERS_KEY);

					//Check that the house is enabled and that the codes match
					if(preferenceDocument.data()!.isHouseEnabled){
						res.status(412).send("House Competition must be disabled before this is run.");
					}
					else if(preferenceDocument.data()!.OneTimeCode !== req.query.code){
						res.status(400).send("Invalid Code");
					}
					else{
						//Iterate through the residents in batches 
						usersRef.get().then(async listOfUserSnapshots =>{
							//Get the number of users
							const count = listOfUserSnapshots.docs.length;
							let i = 0;

							//create a batch job
							let batch = db.batch();
							while( i < count){

								//add an update to the user for the batch job
								const ref = db.collection(USERS_KEY).doc(listOfUserSnapshots.docs[i].id)
								batch.update(ref, {LastSemesterPoints: listOfUserSnapshots.docs[i].data().TotalPoints})
								i ++;

								//A batch job can only update 500 objects at a time, so at 499 commit the batch, and create a new one
								if(i === 499){
									await batch.commit()
									batch = db.batch();
								}
							}
							//Reset the OneTimeCode on the server
							batch.update(db.collection(SYSPREF_KEY).doc("Preferences"),{OneTimeCode: randomString(50)});
							await batch.commit()
							//Post completion html/ message
							res.status(200).send("Complete");
						}).catch(err => { res.status(500).send("Failed to get Users: "+res)})
					}
				})
				.catch( err => res.send(500).send("Failed to retrieve system preferences with error: "+res));
})

/**
 * Post function to send an email to reset the house competition
 */
comp_app.post('/reset-house-competition', (req, res) => {
	//Get user id. Check the house. Get the rank of the user
	db.collection(USERS_KEY).doc(req["user"]["user_id"]).get()
	.then(async userDocument => {
		if(userDocument.exists ){
			const permissionLevel = userDocument.data()!["Permission Level"];
			if(permissionLevel === 2){
				const secretKey = randomString(50);
				const path = "https://"+req.hostname+"/competition/secret-reset-house-competition?code="+secretKey;
				
				await db.collection(SYSPREF_KEY).doc("Preferences").update({OneTimeCode: secretKey});
				const mailOptions = {
					from: 'Purdue HCR Contact <purduehcrcontact@gmail.com',
					to: req["user"]["email"],
					subject: "Set Semester Points",
					html: createResetHouseCompetitionEmail(path)
				};
				transporter.sendMail(mailOptions,  (erro, info) =>{
					if(erro){
						return res.status(500).send(erro);
					}
					else{
						return res.status(200).send("Confirmation sent");
					}
				})
			}
			else{
				res.status(409).send("User does not have sufficient permissions to perform this action.");
			}
			
		}
		else{
			res.status(410).send("Undefined User Role");
		}
	})
	.catch(err => res.status(500).send("Failed to retrieve user with error: "+ res));
})

/**
 * Get request; the button in the reset house competition email will call this function
 */
comp_app.get('/secret-reset-house-competition', (req,res) => {
	db.collection("SystemPreferences").doc("Preferences").get()
				.then(preferenceDocument =>{
					//Check that the house competition is still disabled
					if(preferenceDocument.data()!.isHouseEnabled){
						res.status(412).send("House Competition must be disabled before this is run.");
					}
					else if(preferenceDocument.data()!.OneTimeCode !== req.query.code){
						res.status(400).send("Invalid Code");
					}
					else{
						//TODO Complete actual deletion
						res.status(200).send("Complete");
					}
				})
				.catch( err => res.send(500).send("Failed to retrieve system preferences with error: "+res));
})


/**
 * Generate a random string
 * 
 * @param length length of the string
 */
function randomString(length) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}