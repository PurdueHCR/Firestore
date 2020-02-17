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
import { PointLog } from './models/PointLog';

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





//setup Cors for cross site requests
admin_app.use(cors({origin:true}));
//Setup firestoreTools to validate user has been 
admin_app.use(firestoreTools.validateFirebaseIdToken);

export class UserPointsFromDate {
    id: String
    firstName: String
    lastName: String
    logs: PointLog[] = []
    points: number

    constructor(id, first, last){
        this.id = id
        this.firstName = first
        this.lastName = last
        this.points = 0
    }

    isUser(id){
        return this.id === id
    }

    addLog(pointLog, value){
        this.logs.push(pointLog)
        this.points += value
    }
}

/**
 * Post Function that sends an email to confirm the saving of the semester points
 */
admin_app.get('/json_backup', (req, res) => {
    const houseCompetition = new HouseCompetition()
    
    db.collection(HouseCompetition.HOUSE_KEY).get()
    .then(async houseDocuments =>{
        let hIterator = 0;
        while(hIterator < houseDocuments.docs.length){
            houseCompetition.houses.push(House.houseFromFirebaseDoc((houseDocuments.docs[hIterator])));
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
                                    houseCompetition.users.push(User.fromDocument((userDocuments.docs[uIterator])));
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

admin_app.get('/house_submissions_from_date', (req, res) => {

    db.collection(HouseCompetition.POINT_TYPES_KEY).get()
    .then(async pointTypeDocuments =>{
        const pts: PointType[] = []
        for( const pt of pointTypeDocuments.docs){
            pts.push(new PointType(pt))
        }

        const date = new Date(Date.parse(req.query.date))
        db.collection(HouseCompetition.HOUSE_KEY).doc(req.query.house).collection('Points').where('DateSubmitted', '>', date).get()
        .then(async pointLogDocuments =>{
            
            //Create new list of users
            const users: UserPointsFromDate[] = []
            //iterate through all of the pointlog documents
            for(const plIterator of pointLogDocuments.docs ){

                //create the point log
                const pl = new PointLog(plIterator)

                //If the point log has been approved
                if(pl.pointTypeId > 0){
                    //Iterate through the point types
                    for( const ptIterator of pts ){
                        //If the point types is found
                        if(ptIterator.id === pl.pointTypeId.toString()){

                            //Assigned means it hasnt been used
                            let assigned = false
                            //Iterate through all the users
                            for( const usrIterator of users) {
                                //If the user exists, add the pointlog to the user
                                if(usrIterator.id === pl.residentId){
                                    assigned = true
                                    usrIterator.addLog(pl, ptIterator.value)
                                }
                            }

                            //If no user was found, add the user
                            if(!assigned){
                                const user = new UserPointsFromDate(pl.residentId, pl.residentFirstName, pl.residentLastName)
                                user.addLog(pl, ptIterator.value)
                                users.push(user)
                            }
                            break
                        }
                    }
                }
            }
            //Resturn json object with the users
            res.status(200).send(JSON.stringify(users))
        })
        .catch(err => res.status(200).send("2 "+err));
    })
    .catch(err => res.status(402).send("1 "+ err));
})

// competition_main is the object to be exported. export this in index.ts
export const administration_main = functions.https.onRequest(admin_main);
