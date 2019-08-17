import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const cors = require('cors');
const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));


// webApi is your functions name, and you will pass main as 
// a parameter
export const webApi = functions.https.onRequest(main);

const houses = 'House';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


app.use(cors({origin:true}));

app.get('/hello',(req,res) => {
	res.send('Hello PurdueHCR');
})

//View houses
app.get('/houses',cors({origin:true}), (req,res) => {
	db.collection(houses).get()
	.then(snapshot => {
		var data = "{\n\t\"houses\": [\n\t  ";
		snapshot.forEach(doc => {
			if(data.length > 20){
				data = data+",";
			}
			data = data + 
			"{\n"+
			"\t\t\"HouseName\": \""+doc.id+"\",\n"+
			"\t\t\"TotalPoints\": "+doc.data().TotalPoints+",\n"+
			"\t\t\"Color\": \""+doc.data().Color+"\"\n"+
			"\t  }"; 
		});
		res.status(200).send(data+"\n\t]\n}");
	})
	.catch(err => res.status(500).send(res));
})

