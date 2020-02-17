import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { HouseCode } from './models/Housecode';
import {User} from './models/User';

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}
const db = admin.firestore();
const users_app = express();
const cors = require('cors');
const users_main = express();

users_main.use(users_app);
users_main.use(bodyParser.json());
users_main.use(bodyParser.urlencoded({ extended: false }));

const firestoreTools = require('./firestoreTools');

export const user_main = functions.https.onRequest(users_main);

//const houses = 'House';
const users = 'Users'
const houseCodes = 'HouseCodes'


users_app.use(cors({origin:true}));
users_app.use(firestoreTools.validateFirebaseIdToken);


users_app.get('/rank',  (req,res) => {
	//Get user id. Check the house. Get the rank of the user
	const userId = req.header('User-Auth')
	if(userId === "" || userId === undefined){
		res.status(401).send("Missing Authorization");
	}
	db.collection(users).doc(userId!).get()
	.then(userDocument => {
		if(userDocument.exists ){
			const houseName = userDocument.data()!.House;
			db.collection(users)
			.where('House', '==', houseName)
				.get()
				.then(snapshot => {
					snapshot.docs.sort((u1,u2) => u2.data().TotalPoints - u1.data().TotalPoints)
					let i = 1;
					while(i <= snapshot.docs.length && snapshot.docs[i-1].data().TotalPoints !== userDocument.data()!.TotalPoints){
						i ++;
					}
					res.status(200).send(""+i);
				}
			).catch(err => {
				res.status(400).send(res);
			})
		}
		else{
			res.status(400).send("Could not find the user with Id: "+userId);
		}
	})
	.catch(err => res.send(500).send(res));
	
})

users_app.get('/auth-rank',  (req, res) => {
	//Get user id. Check the house. Get the rank of the user
	db.collection(users).doc(req["user"]["user_id"]).get()
	.then(userDocument => {
		if(userDocument.exists ){
			const houseName = userDocument.data()!.House;
			db.collection(users)
			.where('House', '==', houseName)
				.get()
				.then(snapshot => {
					snapshot.docs.sort((u1,u2) => u2.data().TotalPoints - u1.data().TotalPoints)
					let houseRank = 1;
					while(houseRank <= snapshot.docs.length && snapshot.docs[houseRank-1].data().TotalPoints !== userDocument.data()!.TotalPoints){
						houseRank ++;
					}

					snapshot.docs.sort((u1,u2) => (u2.data().TotalPoints -  u2.data().LastSemesterPoints) - (u1.data().TotalPoints - u1.data().LastSemesterPoints))
					let semesterRank = 1;
					while(semesterRank <= snapshot.docs.length && 
							(snapshot.docs[semesterRank-1].data().TotalPoints - snapshot.docs[semesterRank-1].data().LastSemesterPoints) 
							!== (userDocument.data()!.TotalPoints - userDocument.data()!.LastSemesterPoints)){
						semesterRank ++;
					}

					res.status(200).send(
						"{\n"+
							"\t\"houseRank\" : "+houseRank +",\n"+
							"\t\"semesterRank\" : "+semesterRank+"\n"+
						"}");
				}
			).catch(err => {
				res.status(500).send("Failed to sort house users with error: "+ res);
			})
		}
		else{
			res.status(410).send("Undefined User Role");
		}
	})
	.catch(err => res.status(500).send("Failed to retrieve user with error: "+ res));
	
})


users_app.post('/create', (req, res) => {
	//req["user"] is assigned in the FirebaseTools after user is authenticated
	if(req.query.first === null || req.query.last === null || req.query.code === null){
		res.status(422).send("Missing required parameters")
	}
	else{
		db.collection(users).doc(req["user"]["user_id"]).get().then(userDocument => {
			if(userDocument.exists){
				res.status(421).send("User already exists")
			}
			else{
				db.collection(houseCodes).get().then(houseCodeDocs => {
					let found = false
					for( const codeDoc of houseCodeDocs.docs){
						if(codeDoc.data()["Code"] === req.query.code){
							found = true
							const code = new HouseCode(codeDoc)
							const user = User.fromCode(req.query.first,  req.query.last, req["user"]["user_id"], code)
								db.collection(users).doc(req["user"]["user_id"]).set(user.toJson()).then(ref =>{
									res.status(200).send(user.toJson())
								}	
							)
							.catch( err => {
								res.status(400).send("Firestore failed with error:  "+err)
							})
						}
					}
					if(!found)
						res.status(409).send("House Code Does Not Exist");
				})
				.catch(err => {
					res.send(500)
				})
			}
		})
		.catch(err =>{
			res.status(400).send("Firestore failed with error:  "+err)
		})
	}
	
})