import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import {User} from "../models/User";
import { HouseCompetition } from '../models/HouseCompetition';
import { House } from '../models/House';
import { HouseCode } from '../models/Housecode';
import { Link } from '../models/Link';
import { PointType } from '../models/PointType';
import { Reward } from '../models/Reward';
import { PointLog } from '../models/PointLog';

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}

const db = admin.firestore();
const admin_app = express();
const cors = require('cors');
const admin_main = express();
const firestoreTools = require('../firestoreTools');

admin_main.use(admin_app);
admin_app.use(express.json());
admin_app.use(express.urlencoded({ extended: false }));





//setup Cors for cross site requests
admin_app.use(cors({origin:true}));
//Setup firestoreTools to validate user has been 
admin_app.use(firestoreTools.flutterReformat)
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
    .then(async housesSnapshot =>{
        houseCompetition.houses = House.fromQuerySnapshot(housesSnapshot)
        db.collection(HouseCompetition.HOUSE_CODES_KEY).get()
        .then(async houseCodeDocuments =>{
            let hcIterator = 0;
            while(hcIterator < houseCodeDocuments.docs.length){
                houseCompetition.houseCodes.push(HouseCode.fromDocumentSnapshot(houseCodeDocuments.docs[hcIterator]));
                hcIterator++;
            }
            db.collection(HouseCompetition.LINKS_KEY).get()
            .then(async linkDocuments =>{
                houseCompetition.links = Link.fromQuerySnapshot(linkDocuments)
                db.collection(HouseCompetition.POINT_TYPES_KEY).get()
                .then(async pointTypeSnapshot =>{
                    houseCompetition.pointTypes = PointType.fromQuerySnapshot(pointTypeSnapshot)
                    db.collection(HouseCompetition.REWARDS_KEY).get()
                    .then(async rewardDocuments =>{
                        houseCompetition.rewards = Reward.fromQuerySnapshot(rewardDocuments)
                        db.collection(HouseCompetition.USERS_KEY).get()
                            .then(async userDocuments =>{
                                houseCompetition.users = User.fromQuerySnapshot(userDocuments);
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

admin_app.get('/house_submissions_from_date', (req, res) => {

    db.collection(HouseCompetition.POINT_TYPES_KEY).get()
    .then(async pointTypeDocuments =>{
        const pts  = PointType.fromQuerySnapshot(pointTypeDocuments)

        const date = new Date(Date.parse(req.query.date as string))
        db.collection(HouseCompetition.HOUSE_KEY).doc(req.query.house as string).collection('Points').where('DateSubmitted', '>', date).get()
        .then(async pointLogsSnapshot =>{
            
            //Create new list of users
            const users: UserPointsFromDate[] = []
            const pointLogs = PointLog.fromQuerySnapshot(pointLogsSnapshot)
            //iterate through all of the pointlog documents
            for(const pl of pointLogs){

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
