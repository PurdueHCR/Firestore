import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import {createSaveSemesterPointsEmail} from "../email_functions/SaveSemesterPointsEmail"
import {createResetHouseCompetitionEmail} from "../email_functions/ResetHouseCompetitionEmail"
import { getUnhandledPointLogs } from '../src/GetUnhandledLogs'
import { HouseCompetition } from '../models/HouseCompetition'
import { PointLog } from '../models/PointLog'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'
import { getResidentProfile, getRHPProfile } from '../src/GetUserProfiles'
import { getUser } from '../src/GetUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getRecentHistory, getHistoryFilterUser, getHistoryFilterPointType} from '../src/GetHistory'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { updateSystemPreferences } from '../src/SetSystemPreference'
import { saveAndResetSemester } from '../src/SaveAndResetSemester'
import {verifyOneTimeCode, generateOneTimeCode} from '../src/OTCGenerator'
import {resetHouseCompetition} from '../src/ResetHouseCompetition'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const comp_app = express()
const cors = require('cors')
const comp_main = express()
const nodemailer = require('nodemailer')
const firestoreTools = require('../firestoreTools')

comp_main.use(comp_app)
comp_app.use(express.json())
comp_app.use(express.urlencoded({ extended: false }))



// competition_main is the object to be exported. export this in index.ts
export const competition_main = functions.https.onRequest(comp_main)

let auth: any
if(functions.config().email_auth === undefined){
	auth = require("../../development_keys/email_auth.json")
}
else{
	auth = functions.config().email_auth
}
//Setup the Sending Email Control
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: auth
})


//setup Cors for cross site requests
comp_app.use(cors({origin:true}))
//Setup firestoreTools to validate user has been 
comp_app.use(firestoreTools.flutterReformat)
comp_app.use(firestoreTools.validateFirebaseIdToken)


/**
 * Get the System Preferences 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 500 - Server Error
 */
comp_app.get('/settings', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
		const systemPreferences = await getSystemPreferences();
		
		res.status(APIResponse.SUCCESS_CODE).send({settings:systemPreferences})
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.error("Unknown Error getting competition system prefernces: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
	}
})

/**
 * Update the System Preferences 
 * @params req.body.competitionHiddenMessage - string
 * @params req.body.isCompetitionVisible - bool
 * @params req.body.competitionDisabledMessage - string
 * @params req.body.isCompetitionEnabled - bool
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parameters
 * @throws 426 - Incorrect Format
 * @throws 500 - Server Error
 */
comp_app.put('/settings', async (req, res) => {
	try{
		if(req.body === undefined || 
			(req.body.competitionHiddenMessage === undefined && !("isCompetitionVisible" in req.body) && req.body.competitionDisabledMessage === undefined && !("isCompetitionEnabled" in req.body)))
			throw APIResponse.MissingRequiredParameters()

		const competitionHiddenMessage = req.body.competitionHiddenMessage
		const competitionDisabledMessage = req.body.competitionDisabledMessage
		const user = await getUser(req["user"]["user_id"])
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
		const systemPreferences = await getSystemPreferences();
		
		if(competitionHiddenMessage !== undefined){
			if(typeof competitionHiddenMessage === 'string')
			systemPreferences.competitionHiddenMessage = competitionHiddenMessage
			else
				throw APIResponse.IncorrectFormat()
		}
		if("isCompetitionVisible" in req.body){
			console.log(typeof req.body.isCompetitionVisible)
			if(req.body.isCompetitionVisible === 'false' || req.body.isCompetitionVisible === 'true')
				systemPreferences.isCompetitionVisible = req.body.isCompetitionVisible === 'true'
			else if(req.body.isCompetitionVisible === true || req.body.isCompetitionVisible === false){
				systemPreferences.isCompetitionVisible = req.body.isCompetitionVisible
			}
			else
				throw APIResponse.IncorrectFormat()
		}
		if(competitionDisabledMessage !== undefined){
			if(typeof competitionDisabledMessage === 'string')
			systemPreferences.competitionDisabledMessage = competitionDisabledMessage
			else
				throw APIResponse.IncorrectFormat()
		}
		if( "isCompetitionEnabled"  in req.body){
			if(req.body.isCompetitionEnabled === 'false' || req.body.isCompetitionEnabled === 'true')
				systemPreferences.isCompetitionEnabled = req.body.isCompetitionEnabled === 'true'
			else if(req.body.isCompetitionEnabled === false || req.body.isCompetitionEnabled === true)
				systemPreferences.isCompetitionEnabled = req.body.isCompetitionEnabled
			else
				throw APIResponse.IncorrectFormat()
		}
		await updateSystemPreferences(systemPreferences)
		
		throw APIResponse.Success()
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.error("Unknown Error getting competition system prefernces: "+error.toString())
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
comp_app.post('/endSemester', async (req, res) => {
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
					from: 'Purdue HCR Contact <purduehcrcontact@gmail.com>',
					to: req["user"]["email"],
					subject: "Ending The Semester in the House Competition",
					html: createSaveSemesterPointsEmail(path)
				}

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
comp_app.get('/confirmEndSemester', async (req, res) => {

	try{
		if(req.query.code === undefined || typeof req.query.code !== 'string' || req.query.code === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		verifyOneTimeCode(req.query.code)
		const systemPreferences = await getSystemPreferences()
		if(systemPreferences.isCompetitionEnabled){
			throw APIResponse.CompetitionDisabled()
		}
		else{
			await saveAndResetSemester()
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
comp_app.post('/resetCompetition', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){

			const systemPreferences = await getSystemPreferences()
			if(!systemPreferences.isCompetitionEnabled){
				//Generate random key, save it to the house system and create a link 
				const secretKey = generateOneTimeCode()
				const path = "https://"+req.hostname+"/competition/confirmResetCompetition?code="+secretKey+"&user="+user.id
				
				const mailOptions = {
					from: 'Purdue HCR Contact <purduehcrcontact@gmail.com>',
					to: req["user"]["email"],
					subject: "Resetting the House Competition",
					html: createResetHouseCompetitionEmail(path)
				}
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
comp_app.get('/confirmResetCompetition', async (req,res) => {
	try{
		if(req.query.code === undefined || typeof req.query.code !== 'string' || req.query.code === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		else if(req.query.user === undefined || typeof req.query.user !== 'string' || req.query.user === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		const user = await getUser(req.query.user)
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			verifyOneTimeCode(req.query.code)
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


/**
 * Get the unhandled points for a house
 * @param limit - optional limit for how many to retrieve
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 500 - Server Error
 */
comp_app.get('/getUnhandledPoints', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		let logs: PointLog[]
		if(req.query.limit !== undefined){
			logs = await getUnhandledPointLogs(user, parseInt(req.query.limit as string))
		}
		else{
			logs = await getUnhandledPointLogs(user)
		}
		
		res.status(APIResponse.SUCCESS_CODE).send({point_logs:logs})
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
 * Get the data that is most pertinent to the given user.
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions (This should not ever be sent because we sort permissions here, but it could be sent)
 * @throws 500 - Server Error
 */
comp_app.get('/userOverview', async (req, res) => {
	try{
		const user = await getUser(req["user"]["user_id"])
		if(user.permissionLevel === UserPermissionLevel.RESIDENT){
			const resident_profile = await getResidentProfile(user)
			res.status(APIResponse.SUCCESS_CODE).send({"resident":resident_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.RHP){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const resident_profile = await getRHPProfile(user)
			res.status(APIResponse.SUCCESS_CODE).send({"rhp":resident_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.PRIVILEGED_RESIDENT){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const resident_profile = await getResidentProfile(user)
			res.status(APIResponse.SUCCESS_CODE).send({"privileged_resident":resident_profile})
		}
		else{
			console.error("Other user permissions not yet implemented")
			const apiResponse = APIResponse.InvalidPermissionLevel()
            res.status(apiResponse.code).send(apiResponse.toJson())
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

/**
 * Get the history of point submissions for a house
 * @param query.type Required param to determine what search category to have (recent, user, point_type)
 * @param query.point_type_id Integer for the point id. Required if the search type is 'point_type'.
 * @param query.last_name String of the last name of the user to search for. Required when the search type is user.
 * @param query.date Date to use as the starting point for a 'recent' query. Not required.
 * @param query.startAt: Date to use in pagenation
 * @param query.house: String to use as the house id if the current user is a Professional Staff
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 422 - Missing required parameters
 * @throws 423 - InvalidDateFormat
 * @throws 425 - UnknownHouse
 * @throws 426 - IncorrectFormat
 * @throws 500 - Server Error
 */
comp_app.get('/history', async (req, res) => {
	try{
		if(req.query === undefined || req.query.type === undefined){
			console.error("Query is not defined or type is not defined.")
			const error = APIResponse.MissingRequiredParameters()
			res.status(error.code).send(error.toJson())
		}
		else{
			
			let startAt:Date | null = null
			if(req.query.startAt !== undefined && !isNaN(Date.parse(req.query.startAt as string))){
				startAt = new Date(Date.parse(req.query.startAt as string))
			}
			else if (req.query.startAt !== undefined && isNaN(Date.parse(req.query.startAt as string))){
				console.error("Invalid date")
				throw APIResponse.InvalidDateFormat()
			}

			if(req.query.type === "recent"){
				let date:Date = new Date(Date.now())
				if(req.query.date !== undefined && !isNaN(Date.parse(req.query.date as string))){
					date = new Date(Date.parse(req.query.date as string))
					
				}
				else if (req.query.date !== undefined && isNaN(Date.parse(req.query.date as string))){
					console.error("Invalid date")
					throw APIResponse.InvalidDateFormat()
				}
				date.setHours(23,59,59)
				const user = await getUser(req["user"]["user_id"])
				verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF])
				const house_name = getHouseNameForHistory(user, req)
				
				let point_logs: PointLog[]
				if(startAt === null){
					point_logs = await getRecentHistory(house_name, date)
				}
				else{
					point_logs = await getRecentHistory(house_name, date, startAt)
				}
				res.status(APIResponse.SUCCESS_CODE).send({point_logs:point_logs})
				

			}
			else if(req.query.type === "user"){
				if(req.query.last_name === undefined || req.query.last_name === ""){
					const error = APIResponse.MissingRequiredParameters()
						res.status(error.code).send(error.toJson())
				}
				else{
					const user = await getUser(req["user"]["user_id"])
					verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF])
					const house_name = getHouseNameForHistory(user, req)
					let point_logs: PointLog[]
					if(startAt === null){
						point_logs = await getHistoryFilterUser(house_name, req.query.last_name as string)
					}
					else{
						point_logs = await getHistoryFilterUser(house_name, req.query.last_name as string, startAt)
					}

					res.status(APIResponse.SUCCESS_CODE).send({point_logs:point_logs})
				}
				
			}
			else if(req.query.type === "point_type"){
				if(req.query.point_type_id === undefined){
					console.error("Point type id is not provided")
					throw APIResponse.MissingRequiredParameters()
				}
				else if(parseInt(req.query.point_type_id as string) <= 0){
					console.error("Point type id can not be 0 or a negative number")
					throw APIResponse.IncorrectFormat()
				}
				else{
					const user = await getUser(req["user"]["user_id"])
					verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF])
					const house_name = getHouseNameForHistory(user, req)
					let point_logs: PointLog[]
					if(startAt === null){
						point_logs = await getHistoryFilterPointType(house_name, parseInt(req.query.point_type_id as string))
					}
					else{
						point_logs = await getHistoryFilterPointType(house_name, parseInt(req.query.point_type_id as string), startAt)
					}
					res.status(APIResponse.SUCCESS_CODE).send({point_logs:point_logs})
				}
			}
			else{
				console.error("Type parameter is not a valid format.")
				throw APIResponse.IncorrectFormat()
			}
		}
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
		}
		else if(error instanceof TypeError){
			console.error("Got a typeof error: "+error)
			const apiResponse = APIResponse.IncorrectFormat()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
        else {
            console.error("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
	}
})

/**
 * If the house field is provided and the user is Proffesional Staff, use the house field. If user is not prof staff, it returns the user house
 * @param user User making request
 * @param req Request object to check for query param
 * @return house id to use
 * @throws 422 - Missing Required Parameters
 * @throws 425 - Unknown User
 */
function getHouseNameForHistory(user:User, req): string{
	let house_name = user.house
	if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
		if(req.query.house === undefined || req.query.house === ""){
			throw APIResponse.MissingRequiredParameters()
		}
		else{
			HouseCompetition.validateHouseName(req.query.house as string)
			house_name = req.query.house as string
		}
	}
	return house_name
}

