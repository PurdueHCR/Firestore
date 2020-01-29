import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import {User} from "./models/User";
import { HouseCompetition } from './models/HouseCompetition';
import { House } from './models/House';
import { HouseCode } from './models/Housecode';
import { Link } from './models/Link';
import { PointType } from './models/PointType';
import { Reward } from './models/Reward';

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}

const db = admin.firestore();
const admin_app = express();
const cors = require('cors');
const admin_main = express();
const firestoreTools = require('./firestoreTools');

admin_main.use(admin_app);
admin_main.use(bodyParser.json());
admin_main.use(bodyParser.urlencoded({ extended: false }));



// competition_main is the object to be exported. export this in index.ts
export const administration_main = functions.https.onRequest(admin_main);


//setup Cors for cross site requests
admin_app.use(cors({origin:true}));
//Setup firestoreTools to validate user has been 
admin_app.use(firestoreTools.validateFirebaseIdToken);



/**
 * Post Function that sends an email to confirm the saving of the semester points
 */
admin_app.get('/json_backup', (req, res) => {
    const houseCompetition = new HouseCompetition()
    
    db.collection(HouseCompetition.HOUSE_KEY).get()
    .then(async houseDocuments =>{
        let hIterator = 0;
        while(hIterator < houseDocuments.docs.length){
            houseCompetition.houses.push(new House((houseDocuments.docs[hIterator])));
            hIterator++;
        }
        db.collection(HouseCompetition.HOUSE_CODES_KEY).get()
        .then(async houseCodeDocuments =>{
            let hcIterator = 0;
            while(hcIterator < houseCodeDocuments.docs.length){
                houseCompetition.houseCodes.push(new HouseCode((houseCodeDocuments.docs[hcIterator])));
                hcIterator++;
            }
            db.collection(HouseCompetition.LINKS_KEY).get()
            .then(async linkDocuments =>{
                let lIterator = 0;
                while(lIterator < linkDocuments.docs.length){
                    houseCompetition.links.push(new Link((linkDocuments.docs[lIterator])));
                    lIterator++;
                }
                db.collection(HouseCompetition.POINT_TYPES_KEY).get()
                .then(async pointTypeDocuments =>{
                    let ptIterator = 0;
                    while(ptIterator < pointTypeDocuments.docs.length){
                        houseCompetition.pointTypes.push(new PointType((pointTypeDocuments.docs[ptIterator])));
                        ptIterator++;
                    }
                    db.collection(HouseCompetition.REWARDS_KEY).get()
                    .then(async rewardDocuments =>{
                        let rIterator = 0;
                        while(rIterator < rewardDocuments.docs.length){
                            houseCompetition.rewards.push(new Reward((rewardDocuments.docs[rIterator])));
                            rIterator++;
                        }
                        db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).get()
                        .then(async sysPrefDocs =>{
                            let spIterator = 0;
                            while(spIterator < sysPrefDocs.docs.length){
                                houseCompetition.systemPreference.set((sysPrefDocs.docs[spIterator]));
                                spIterator++;
                            }
                            db.collection(HouseCompetition.USERS_KEY).get()
                            .then(async userDocuments =>{
                                let uIterator = 0;
                                while(uIterator < userDocuments.docs.length){
                                    houseCompetition.users.push(new User((userDocuments.docs[uIterator])));
                                    uIterator++;
                                }
                                res.status(200).send(JSON.stringify(houseCompetition));
                            })
                            .catch(err => res.send(500).send(err));
                        })
                        .catch(err => res.send(500).send(err));
                    })
                    .catch(err => res.send(500).send(err));
                })
                .catch(err => res.send(500).send(err));
            })
            .catch(err => res.send(500).send(err));
        })
        .catch(err => res.send(500).send(err));
    })
    .catch(err => res.send(500).send(err));
})