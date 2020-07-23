import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import {User} from "../models/User";
import { HouseCompetition } from '../models/HouseCompetition';
import { Link } from '../models/Link';
import { PointType } from '../models/PointType';
import { Reward } from '../models/Reward';
import { APIResponse } from '../models/APIResponse';
import { getHouseCodes } from '../src/GetHouseCodes';
import { getUser } from '../src/GetUser';
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission';
import { UserPermissionLevel } from '../models/UserPermissionLevel';
import { HouseWithPointLog } from '../models/House';
import { PointLog } from '../models/PointLog';

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}

const db = admin.firestore();
const admin_app = express();
const cors = require('cors');
const nodemailer = require('nodemailer')
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

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'purduehcrcontact@gmail.com',
		pass: 'Honors1!'
	}
})


/**
 * Get a json_backup
 */
admin_app.get('/json_backup', async (req, res) => {

    const houseCompetition = new HouseCompetition()
    try{

        const user = await getUser(req["user"]["user_id"])
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])

        houseCompetition.houses = HouseWithPointLog.fromQuerySnapshot(await db.collection(HouseCompetition.HOUSE_KEY).get())
        for(const house of houseCompetition.houses){
            house.pointLogs = PointLog.fromQuerySnapshot(await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).get())
        }
        houseCompetition.houseCodes = await getHouseCodes()
        houseCompetition.links = Link.fromQuerySnapshot(await db.collection(HouseCompetition.LINKS_KEY).get())
        houseCompetition.pointTypes = PointType.fromQuerySnapshot(await db.collection(HouseCompetition.POINT_TYPES_KEY).get())
        houseCompetition.users = User.fromQuerySnapshot(await db.collection(HouseCompetition.USERS_KEY).get())
        houseCompetition.rewards = Reward.fromQuerySnapshot(await db.collection(HouseCompetition.REWARDS_KEY).get())
        const mailOptions = {
            from: 'Purdue HCR Contact <purduehcrcontact@gmail.com',
            to: req["user"]["email"],
            subject: "Backup for PurdueHCR House Competition",
            html: "Backup for PurdueHCR House Competition",
            attachments:[
                {   // utf-8 string as an attachment
                    filename: `purduehcr-backup-${(new Date()).toString()}.json`,
                    content: JSON.stringify(houseCompetition)
                },
            ]
        }
        //Send mail
        transporter.sendMail(mailOptions,  (erro, _info) =>{
            if(erro){
                console.log("Sending email error: "+erro)
            }
        })
        throw APIResponse.Success()
    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.error("Unknown Error on endSemester: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
	}
    
    
})


// competition_main is the object to be exported. export this in index.ts
export const administration_main = functions.https.onRequest(admin_main);
