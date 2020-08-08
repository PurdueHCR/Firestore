import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import {User} from "../models/User"
import { HouseCompetition } from '../models/HouseCompetition'
import { Link } from '../models/Link'
import { PointType } from '../models/PointType'
import { Reward } from '../models/Reward'
import { APIResponse } from '../models/APIResponse'
import { getHouseCodes } from '../src/GetHouseCodes'
import { getUser } from '../src/GetUser'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseWithPointLog } from '../models/House'
import { PointLog } from '../models/PointLog'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { generateOneTimeCode, verifyOneTimeCode } from '../src/OTCGenerator'
import { createSaveSemesterPointsEmail } from '../email_functions/SaveSemesterPointsEmail'
import { saveAndResetSemester } from '../src/SaveAndResetSemester'
import { createResetHouseCompetitionEmail } from '../email_functions/ResetHouseCompetitionEmail'
import { resetHouseCompetition } from '../src/ResetHouseCompetition'
import * as ParameterParser from '../src/ParameterParser'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const nodemailer = require('nodemailer')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2

const db = admin.firestore()
const admin_app = express()
const cors = require('cors')
const admin_main = express()
const firestoreTools = require('../firestoreTools')

admin_main.use(admin_app)
admin_app.use(express.json())
admin_app.use(express.urlencoded({ extended: false }))



//setup Cors for cross site requests
admin_app.use(cors({origin:true}))
//Setup firestoreTools to validate user has been 
admin_app.use(firestoreTools.flutterReformat)
admin_app.use(firestoreTools.validateFirebaseIdToken)


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
            from: 'Purdue HCR Contact <purduehcr@gmail.com',
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
        const transporter = createMailTransporter()()
        //Send mail
        await transporter.sendMail(mailOptions)
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

/**
 * Request the end semester email
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 414 - Competition must be disabled
 * @throws 500 - Server Error
 */
admin_app.post('/endSemester', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){

			const systemPreferences = await getSystemPreferences()
			if(!systemPreferences.isCompetitionEnabled){
				//Generate random key, save it to the house system and create a link 
				const secretKey = generateOneTimeCode()
				const path = "https://"+req.hostname+"/competition/confirmEndSemester?code="+secretKey

				//Set the mail options
				const mailOptions = {
					from: 'Purdue HCR Contact <purduehcr@gmail.com>',
					to: req["user"]["email"],
					subject: "Ending The Semester in the House Competition",
					html: createSaveSemesterPointsEmail(path)
				}
				const transporter = createMailTransporter()
				await transporter.sendMail(mailOptions)
				throw APIResponse.Success()

			}
			else{
				console.error("Competition must be disabled to end the semester")
				throw APIResponse.CompetitionMustBeDisabled()
			}
		}
		else{
			//User is not an REA/REC
			console.error("User must be Professional staff to perform this action")
			throw APIResponse.InvalidPermissionLevel()
		}
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

/**
 * Confirm the end semester. Must be called through the /endSemester endpoint
 */
admin_app.get('/confirmEndSemester', async (req, res) => {

	try{
		if(req.query.code === undefined || typeof req.query.code !== 'string' || req.query.code === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		const code = ParameterParser.parseInputForString(req.query.code)
		verifyOneTimeCode(code)
		const systemPreferences = await getSystemPreferences()
		if(systemPreferences.isCompetitionEnabled){
			throw APIResponse.CompetitionDisabled()
		}
		else{
			await saveAndResetSemester(systemPreferences)
		}
		throw APIResponse.Success()
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.error("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
	}

	
})

/**
 * Request the reset competition email
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 414 - Competition must be disabled
 * @throws 500 - Server Error
 */
admin_app.post('/resetCompetition', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){

			const systemPreferences = await getSystemPreferences()
			if(!systemPreferences.isCompetitionEnabled){
				//Generate random key, save it to the house system and create a link 
				const secretKey = generateOneTimeCode()
				console.log("Using codE: "+secretKey)
				const path = "https://"+req.hostname+"/competition/confirmResetCompetition?code="+secretKey+"&user="+user.id
				
				const mailOptions = {
					from: 'Purdue HCR Contact <purduehcr@gmail.com>',
					to: req["user"]["email"],
					subject: "Resetting the House Competition",
					html: createResetHouseCompetitionEmail(path)
				}
				const transporter = createMailTransporter()
				await transporter.sendMail(mailOptions)
				throw APIResponse.Success()
			}
			else{
				console.error("Competition must be disabled to end the semester")
				throw APIResponse.CompetitionMustBeDisabled()
			}
		}
		else{
			//User is not an REA/REC
			console.error("User must be Professional staff to perform this action")
			throw APIResponse.InvalidPermissionLevel()
		}
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

/**
 * Confirm the reset competition. Must be called through the /resetCompetition endpoint
 */
admin_app.get('/confirmResetCompetition', async (req,res) => {
	try{
		if(req.query.code === undefined || typeof req.query.code !== 'string' || req.query.code === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		else if(req.query.user === undefined || typeof req.query.user !== 'string' || req.query.user === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		const user = await getUser(req.query.user)
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			const code = ParameterParser.parseInputForString(req.query.code)
			verifyOneTimeCode(code)
			const systemPreferences = await getSystemPreferences()
			if(systemPreferences.isCompetitionEnabled){
				throw APIResponse.CompetitionMustBeDisabled()
			}
			else{
				await resetHouseCompetition(user)
			}
			throw APIResponse.Success()
		}
		else{
			throw APIResponse.InvalidPermissionLevel()
		}
		
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.error("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
	}
})


function createMailTransporter(): any {
	let auth: any
	if(functions.config().email_auth === undefined){
		auth = require("../../development_keys/keys.json").email_auth
	}
	else{
		auth = functions.config().email_auth
	}

	const oauth2Client = new OAuth2(auth.client_id, auth.client_secret, "https://developers.google.com/oauthplayground")

	oauth2Client.setCredentials({
		refresh_token: auth.refresh_token
	})

	const accessToken = oauth2Client.getAccessToken()
	//Setup the Sending Email Control
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: "OAuth2",
			user: auth.email,
			clientId: auth.client_id,
			clientSecret: auth.client_secret,
			refreshToken: auth.refresh_token,
			accessToken: accessToken
		}
	})
	return transporter
}

// competition_main is the object to be exported. export this in index.ts
export const administration_main = functions.https.onRequest(admin_main)
