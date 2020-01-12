import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const cors = require('cors');
const main = express();

main.use(app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const firestoreTools = require('./firestoreTools');

// user is your functions name, and you will pass main as 
// a parameter
export const user = functions.https.onRequest(main);

//const houses = 'House';
const users = 'Users'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


app.use(cors({origin:true}));
app.use(firestoreTools.validateFirebaseIdToken);

app.get('/bye',(req,res) => {
	res.send('Hello PurdueHCR');
})

//View houses
/*
app.get('/houses', (req,res) => {
	db.collection(houses).get()
	.then(snapshot => {
		let data = "[";
		snapshot.forEach(doc => {
			if(data.length > 10){
				data = data+",";
			}
			data = data + 
			"\n\t{\n"+
			"\t\t\"Id\": \""+doc.id+"\",\n"+
			"\t\t\"Color\": \""+doc.data().Color+"\",\n"+
			"\t\t\"NumberOfResidents\": "+doc.data().NumberOfResidents+",\n"+
			"\t\t\"TotalPoints\": "+doc.data().TotalPoints+"\n"+
			"\t}"; 
		});
		res.status(200).send(data+"\n]");
	})
	.catch(err => res.status(500).send(res));
})
*/

app.get('/rank',  (req,res) => {
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
					snapshot.docs.sort((u1,u2) => u2.data()!.TotalPoints - u1.data()!.TotalPoints)
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

