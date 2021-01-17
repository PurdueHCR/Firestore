import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { getUnhandledPointLogs } from '../src/GetUnhandledLogs'
import { HouseCompetition } from '../models/HouseCompetition'
import { PointLog } from '../models/PointLog'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getRecentHistory, getHistoryFilterUser, getHistoryFilterPointType} from '../src/GetHistory'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { updateSystemPreferences } from '../src/SetSystemPreference'
import { grantHouseAward } from '../src/GrantHouseAward'
import { getHouseByName } from '../src/GetHouses'
import { updateHouse } from '../src/UpdateHouse'
import APIUtility from './APIUtility'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const comp_app = express()
const cors = require('cors')
const comp_main = express()
const firestoreTools = require('../firestoreTools')

comp_main.use(comp_app)
comp_app.use(express.json())
comp_app.use(express.urlencoded({ extended: false }))



// competition_main is the object to be exported. export this in index.ts
export const competition_main = functions.https.onRequest(comp_main)


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
		APIUtility.validateRequest(req, true)
		const systemPreferences = await getSystemPreferences();
		
		res.status(APIResponse.SUCCESS_CODE).json({settings:systemPreferences})
	}
	catch (error){
        APIUtility.handleError(res,error)
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
		APIUtility.validateRequest(req)

		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
		const systemPreferences = await getSystemPreferences();
		
		if("isCompetitionVisible" in req.body){
			systemPreferences.isCompetitionVisible = APIUtility.parseInputForBoolean(req.body,'isCompetitionVisible')
		}

		if("competitionHiddenMessage" in req.body){
			systemPreferences.competitionHiddenMessage = APIUtility.parseInputForString(req.body,'competitionHiddenMessage')
		}

		if("isShowingRewards" in req.body){
			systemPreferences.showRewards = APIUtility.parseInputForBoolean(req.body,'isShowingRewards')
		}

		if( "isCompetitionEnabled"  in req.body){
			systemPreferences.isCompetitionEnabled = APIUtility.parseInputForBoolean(req.body,'isCompetitionEnabled')
		}

		if("competitionDisabledMessage" in req.body){
			systemPreferences.competitionDisabledMessage = APIUtility.parseInputForString(req.body,'competitionDisabledMessage')
		}

		await updateSystemPreferences(systemPreferences)
		
		throw APIResponse.Success()
	}
	catch (error){
        APIUtility.handleError(res,error)
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
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)
		let logs: PointLog[]
		if(req.query.limit !== undefined){
			const limit = APIUtility.parseInputForNumber(req.query,'limit',0)
			logs = await getUnhandledPointLogs(user, limit)
		}
		else{
			logs = await getUnhandledPointLogs(user)
		}
		
		res.status(APIResponse.SUCCESS_CODE).json({point_logs:logs})
	}
	catch (error){
        APIUtility.handleError(res,error)
	}
})

/**
 * Post a new house Award
 */
comp_app.post('/houseAward', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)

		const house_name = APIUtility.parseInputForString(req.body,'house')
		const ppr = APIUtility.parseInputForNumber(req.body,'ppr', 1)
		const description = APIUtility.parseInputForString(req.body,'description')

		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])

		await grantHouseAward(house_name, ppr, description)
		
		throw APIResponse.Success()
	}
	catch (error){
        APIUtility.handleError(res,error)
	}
})

/**
 * Update fields for the house
 * @param body.house - required id of the house
 * @param body.numberOfResidents - min 0 number of residents for the house
 * @param body.description - of the house
 * @returns 200 - Sucess
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 422 - Missing Required Parameters
 * @throws 425 - Unknown House 
 * @throws 426 - Invalid Data Format
 * @throws 500 - Server Error
 */
comp_app.post('/updateHouse', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)

		const house_id = APIUtility.parseInputForString(req.body,'house')

		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])

		const house = await getHouseByName(house_id)
		if( "numberOfResidents" in req.body){
			house.numberOfResidents = APIUtility.parseInputForNumber(req.body,'numberOfResidents', 0)
		}
		if( "description" in req.body){
			house.description = APIUtility.parseInputForString(req.body,'description')
		}
		//TODO Add rhps[] and floorIds[] 
		await updateHouse(house)
		throw APIResponse.Success()

	}
	catch (error){
        APIUtility.handleError(res,error)
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
		APIUtility.validateRequest(req)
		const type = APIUtility.parseInputForString(req.query, 'type')
		const user = await APIUtility.getUser(req)
		let point_logs: PointLog[] = []
		const house_name = getHouseNameForHistory(user, req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF])
		let startAt:any = undefined
		if('startAt' in req.query){
			startAt = APIUtility.parseInputForDate(req.query, 'startAt')
		}

		switch(type){
			case 'recent':
				let date = new Date()
				if('date' in req.query){
					date = APIUtility.parseInputForDate(req.query, 'date')
				} 
				date.setHours(23,59,59)
				point_logs = await getRecentHistory(house_name, date, startAt)
				break
			case 'user':
				const lastName = APIUtility.parseInputForString(req.query, 'last_name')
				point_logs = await getHistoryFilterUser(house_name, lastName, startAt)
				break
			case 'point_type':
				const pointTypeId = APIUtility.parseInputForNumber(req.query, 'point_type_id',0)
				point_logs = await getHistoryFilterPointType(house_name, pointTypeId, startAt)
				break
			default:
				console.error("Type parameter is not a valid format.")
				throw APIResponse.IncorrectFormat()
		}
		res.status(APIResponse.SUCCESS_CODE).json({point_logs:point_logs})
	}
	catch (error){
		console.error("GET competition/history failed with: " + error.toString())
        APIUtility.handleError(res,error)
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
