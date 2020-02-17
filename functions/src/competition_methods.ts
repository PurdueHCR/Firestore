import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import {createSaveSemesterPointsEmail} from "./email_functions/SaveSemesterPointsEmail";
import {createResetHouseCompetitionEmail} from "./email_functions/ResetHouseCompetitionEmail";
import { PointType } from './models/PointType';
import { HouseCompetition } from './models/HouseCompetition';
import { PointLog } from './models/PointLog';
import { UserPointsFromDate } from './administration';
import { House } from './models/House';
import { User } from './models/User';


class UsersAndErrorWrapper{
	err: any
	userByUserId: Map<string, UserPointsFromDate>

	constructor(err: any, users: Map<string, UserPointsFromDate>){
		this.err = err;
		this.userByUserId = users
	}
}

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

	if(req.query.date === null || req.query.date === ""){
		res.status(400).send("Include a date in the query")
	}

	//Get user id. Check the house. Get the rank of the user
	db.collection("SystemPreferences").doc("Preferences").get()
	.then(preferenceDocument =>{
	//Check that the house is enabled and that the codes match
	if(preferenceDocument.data()!.isHouseEnabled){
		res.status(412).send("House Competition must be disabled before this is run.");
	}
	else if(preferenceDocument.data()!.OneTimeCode !== req.query.code){
		res.status(400).send("Invalid Code");
	}
	else{
		
		//Get the Point Types
		db.collection(HouseCompetition.POINT_TYPES_KEY).get()
		.then(async pointTypeDocuments =>{
			const pts: PointType[] = []
			for( const pt of pointTypeDocuments.docs){
				pts.push(new PointType(pt))
			}

			const date = new Date(Date.parse(req.query.date))
			
			//Get all the houses
			db.collection(HouseCompetition.HOUSE_KEY).get().then(async houseCollectionSnapshot => {
				const houses: House[] = []
				const usersByHouse: Map<string, Map<string, UserPointsFromDate>> = new Map()
				for( const house of houseCollectionSnapshot.docs){
					const hs = House.houseFromFirebaseDoc(house);
					const uaew = await getUserPointsFromDate(hs.id, pts, date)
					if(uaew.err !== null){
						res.status(400).send("Failed "+ uaew.err.message.toString())
						return
					}
					else{
						usersByHouse[hs.id] = uaew.userByUserId
						houses.push(hs)
					}
					
				}
				const usersRef =  db.collection(USERS_KEY);

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
						const user = User.fromDocument(listOfUserSnapshots.docs[i])
						let userNewPointsSinceDate:number = 0
						if(user.house != null && user.house !== "" && usersByHouse[user.house.toString()] != null && usersByHouse[user.house.toString()][user.id.toString()] != null){
							userNewPointsSinceDate = usersByHouse[user.house.toString()][user.id.toString()].points
						}
						batch.update(ref, {LastSemesterPoints: user.totalPoints - userNewPointsSinceDate})
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

			}).catch(err => { res.status(500).send("Failed to get houses: "+res)})
		})
		.catch( err => res.status(500).send("Failed to get Point Types: "+res));
				
	}
	})
	.catch(err => {
		res.status(500).send("Failed to get System Preferences"+ err);
	})
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
						res.status(200).send("UNIMPLEMENTED");
					}
				})
				.catch( err => res.send(500).send("Failed to retrieve system preferences with error: "+res));
})

comp_app.get('/getPointTypes', (req, res) => {
	db.collection("PointTypes").get().then(pointTypeListSnapshot => {
		const pointTypeList: PointType[] = []
		for ( const pointTypeDocument of pointTypeListSnapshot.docs){
			pointTypeList.push(new PointType(pointTypeDocument));
		}
		res.status(200).send(JSON.stringify(pointTypeList))
	}).catch(err =>{
		res.status(400).send(""+err.message);
	})
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


/**
 * Get the points that each user has scored after a date
 * 
 * @param house 
 * @param pts 
 * @param date 
 */
function getUserPointsFromDate(house:string, pts:PointType[], date:Date){
	const userPointsPromise = new Promise<UsersAndErrorWrapper>((resolve, reject) => {
		
		//Get 
	db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection('Points').where('DateSubmitted', '>', date).get()
	.then(async pointLogDocuments =>{

		const usersFromUserID: Map<string, UserPointsFromDate> = new Map()
		//Create new list of users
		//iterate through all of the pointlog documents
		for(const plIterator of pointLogDocuments.docs ){

			//create the point log
			const pl = new PointLog(plIterator)

			//If the point log has been approved
			if(pl.pointTypeId > 0){
				//console.log("We got a point log from (" +pl.residentId+") " + pl.residentFirstName + " "+pl.residentLastName+ " With value: "+pl.pointTypeId)
				//Iterate through the point types
				for( const ptIterator of pts ){
					//If the point types is found
					if(ptIterator.id === pl.pointTypeId.toString()){

						//Assigned means it hasnt been used
						let assigned = false


						if(usersFromUserID[pl.residentId.toString()] != null){
							//console.log("WE GOT ONE!!!!!: "+pl.residentFirstName + " "+pl.residentLastName)
							assigned = true
							usersFromUserID[pl.residentId.toString()].addLog(pl, ptIterator.value)
						}

						//If no user was found, add the user
						if(!assigned){
							//console.log("And a new user!!! with the name of : "+pl.residentFirstName + " "+pl.residentLastName)
							const user = new UserPointsFromDate(pl.residentId, pl.residentFirstName, pl.residentLastName)
							user.addLog(pl, ptIterator.value)
							usersFromUserID[pl.residentId.toString()] =  user
						}
						//point type was found and given to user, so we can break out of the point type loop
						break
					}
				}
			}
		}
		//Resturn json object with the users
		const uaew: UsersAndErrorWrapper = new UsersAndErrorWrapper(null, usersFromUserID)
		resolve(uaew)
	})
	.catch(err => {
		const uaew: UsersAndErrorWrapper = new UsersAndErrorWrapper(err, new Map())
		resolve(uaew) 
	});
	})
	return userPointsPromise
}

