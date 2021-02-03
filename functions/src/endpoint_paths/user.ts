import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { UnsubmittedPointLog } from '../models/UnsubmittedPointLog'
import { submitPoint } from '../src/SubmitPoints'
import { submitLink} from '../src/SubmitLink'
import { getUser, searchForUsers } from '../src/GetUser'
import { createUser } from '../src/CreateUser'
import { getRank } from '../src/GetUserRank'
import { getPointLogsForUser } from '../src/GetPointLogsForUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUserLinks } from '../src/GetUserLinks'
import { getLinkById } from '../src/GetLinkById'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { updateUser, removeUserFromHouse } from '../src/UpdateUser'
import { getHouseByName } from '../src/GetHouses'
import APIUtility from './APIUtility'
import { getEvent } from '../src/GetEventById'
import { submitPointsForEvent } from '../src/SubmitPointsForEvent'

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firestore)
}

const users_app = express()
const cors = require('cors')
const users_main = express()

users_main.use(users_app)
users_app.use(express.json())
users_app.use(express.urlencoded({ extended: true }))

const firestoreTools = require('../firestoreTools')

users_app.use(cors({origin:true}))
users_app.use(firestoreTools.flutterReformat)
users_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Get the houseRank and semesterRank for the requesting user
 * @returns UserRank
 * @throws 400 - NonExistantUser
 * @throws 401 - Unauthroized
 * @throws 403 - Invalid Permission
 * @throws 500 - ServerError
 */
users_app.get('/auth-rank',  async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT])
		const rank = await getRank(user)
		res.status(APIResponse.SUCCESS_CODE).json(rank.toJson())
	}
	catch (error){
        console.error("GET user/auth-rank failed with: " + error.toString())
		APIUtility.handleError(res, error)
    }
})

/**
 * Creates a user
 * @returns User
 * @throws  401 - Unauthorized
 * @throws 	410 - HouseCodeDoesNotExist
 * @throws 	412 - UserAlreadyExists
 * @throws 	422 - MissingRequiredParameters
 * @throws 	500 - ServerError
 */
users_app.post('/create', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const first = APIUtility.parseInputForString(req.body,'first')
		const last = APIUtility.parseInputForString(req.body,'last')
		const code = APIUtility.parseInputForString(req.body,'code')
		const success = await createUser(req["user"]["user_id"], code, first, last)
		const user = await APIUtility.getUser(req)
		res.status(success.code).json(user)
	}
	catch(error){
		console.error("POST user/create failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
	
})

/**
 * Return the user model for the firebase account noted in Authorization header
 * @returns User
 * @throws 	400 - NonExistantUser
 * @throws  401 - Unauthorized
 * @throws 	500 - ServerError 
 */
users_app.get('/', async (req, res) => {

	try{
		APIUtility.validateRequest(req,true)
		const user = await APIUtility.getUser(req)
		res.status(APIResponse.SUCCESS_CODE).json(user)
	}
	catch(error){
		console.error("GET user/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

/**
 * Submit a point through a link
 * 
 * @params body.link_id the id of the link to submit a point with
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission Level
 * @throws 408 - Link Doesnt Exist
 * @throws 409 - Already Claimed this point
 * @throws 412 - House Competition Is Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 419 - Users Can Not Self Submit This Point Type
 * @throws 500 - Server Error
 */
users_app.post('/submitLink', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const linkId = APIUtility.parseInputForString(req.body,'link_id')
		const link = await getLinkById(linkId)
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT])
		const didAddPoints = await submitLink(user,link)
			
		if(!didAddPoints){
			const success = APIResponse.SuccessAwaitsApproval()
			res.status(201).json(success.toJson())
		}
		else {
			const success = APIResponse.SuccessAndApproved()
			res.status(202).json(success.toJson())
		}
	}
	catch(error){
		console.error("POST user/submitLink failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

/**
 * Submit a point with an event
 * @params body.eventId
 * @returns 201 - Success/ Point Awaits Approval
 * @returns 202 - Success/ Point Approved
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission Level
 * @throws 409 - Points already claimed
 * @throws 412 - House Competition Is Disabled
 * @throws 418 - Point Type Is Disabled
 * @throws 426 - Invalid Format
 * @throws 429 - Event Submission Not Open
 * @throws 432 - Can Not Access Event
 * @throws 450 - Nonexistant Event
 * @throws 500 - Server Error
 */
users_app.post('/submitEvent', async (req, res) => {
	try{
		//Validate the input
		APIUtility.validateRequest(req)
		const eventId = APIUtility.parseInputForString(req.body, 'eventId')

		//Retrieve the user and enforce security
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT])

		//Get the event
		const event = await getEvent(eventId)

		//Perform point submission logic
		const didAddPoints = await submitPointsForEvent(user,event)

		//Respond with success messages		
		if(!didAddPoints){
			const success = APIResponse.SuccessAwaitsApproval()
			res.status(201).send(success.toJson())
		}
		else {
			const success = APIResponse.SuccessAndApproved()
			res.status(202).send(success.toJson())
		}

	}
	catch(error){
		console.error("POST user/submitEvent failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

/**
 * Submit a point for this user
 * 
 * @throws  401 - Unauthorized
 * @throws  403 - Invalid Permission Level
 * @throws  412 - House Competition Is Disabled
 * @throws  418 - Point Type Is Disabled
 * @throws  419 - Users Can Not Self Submit This Point Type
 * @throws 	422 - Missing Required Parameters
 * @throws  500 - Server Error
 */
users_app.post('/submitPoint', async (req, res) => {

	try{
		const max = new Date()
		let min_year = max.getFullYear()
		if(max.getMonth() < 7 ){
			min_year --;
		}
		const min = new Date(min_year, 7)

		APIUtility.validateRequest(req)
		const pointTypeId = APIUtility.parseInputForNumber(req.body, 'point_type_id', 0)
		const description = APIUtility.parseInputForString(req.body, 'description')
		const dateOccurred = APIUtility.parseInputForDate(req.body, 'date_occurred', min, max)
		const log = new UnsubmittedPointLog(dateOccurred, description, pointTypeId)
		const user = await APIUtility.getUser(req)
		const didAddPoints = await submitPoint(user, log, user.permissionLevel === UserPermissionLevel.RHP)
		const success = APIResponse.Success()
		//WARNING- This endpoint has the incorrect response codes. if points are added, the standard is 202, but this will resturn 201. In the future, we need to fix this
		if(didAddPoints){
			res.status(201).json(success.toJson())
		}
		else {
			res.status(202).json(success.toJson())
		}
	} catch (error) {
		console.error("POST user/submitPoint failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})


/**
 * Returns a list of point logs submitted by a user
 * 
 * @param query.limit	Optional query parameter. If provided, only return the <limit> most recently submitted points. Else return all submitted points
 * @param query.id	Optional query parameter. If provided, only return the point log with the given id
 * @throws 401 - Unauthorized
 * Any other errors you find while making this code
 * @throws 500 - ServerError
 */
users_app.get('/points', async (req, res) => {
	try {
		APIUtility.validateRequest(req, true)
		const user = await APIUtility.getUser(req)

		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT])
		let pointLogs
		if("limit" in req.query){
			const limit = APIUtility.parseInputForNumber(req.query, 'limit')
			pointLogs = await getPointLogsForUser(user, limit)
		}
		else{
			pointLogs = await getPointLogsForUser(user)
		}
		res.status(APIResponse.SUCCESS_CODE).json({points:pointLogs})
		
	}
	catch (error) {
		console.error("GET user/points failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}

})

/**
 * Gets all links that a user created
 * @throws 400 -  Unknown User
 * @throws 401 - Unauthorized
 * @throws 500 - Server Error
 */
users_app.get('/links', async (req,res) => {
	try {
		APIUtility.validateRequest(req, true)
		const user = await APIUtility.getUser(req)
		const links = await getUserLinks(user.id)
		res.status(APIResponse.SUCCESS_CODE).send({links:links})
	}
	catch (error) {
		console.error("GET user/links failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})


/**
 * Search for a user whose last name starts with the given term
 * @param query.term String term to search for
 * @param query.previousName The last name of the last user returned by a query with the same term
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 422 - Missing required Parameters
 * @throws 426 - Invalid Format
 * @throws 500 - Server Error
 */
users_app.get('/search', async (req,res) => {
	try{
		APIUtility.validateRequest(req)
		
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])
		const lastName = APIUtility.parseInputForString(req.query, 'term')
		if("previousName" in req.query){
			const previousName = APIUtility.parseInputForString(req.query, 'previousName')
			const users = await searchForUsers(lastName, previousName)
			res.status(APIResponse.SUCCESS_CODE).json({users: users})
		}
		else{
			const users = await searchForUsers(lastName)
			res.status(APIResponse.SUCCESS_CODE).json({users: users})
		}
	}
	catch (error) {
		console.error("GET user/search failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

/**
 * Update the user model with the given fields. Every user can update their own first and last name, but only rhps and prof staff can change other aspects of the user
 * @param body.id - Id of the user to update. If the id is null, the current user will be updated
 * @param body.firstName - New first name for the user
 * @param body.lastName - New last name for the user
 * @param body.house - house name for the user. Must be an existing hosue
 * @param body.floorId - new floor id for the user. Must match an existing floor id
 * @param body.permissionLevel - new permission level for the user
 * @param body.enabled - bool for if the user is enabled or not
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parameter
 * @throws 425 - Uknown Hosue
 * @throws 426 - Invalid Format
 * @throws 428 - Invalid Floor Id
 * @throws 500 - Server Error
 */
users_app.put('/', async (req,res) => {
	try{
		APIUtility.validateRequest(req)

		if(!("id" in req.body)){
			//ID not in body means only first and last name can be updated
			if(("firstName" in req.body || "lastName" in req.body)){
				const user = await APIUtility.getUser(req)
				if("firstName" in req.body){
					user.firstName = APIUtility.parseInputForString(req.body,'firstName')
				}
				if("lastName" in req.body){
					user.lastName = APIUtility.parseInputForString(req.body,'lastName')
				}
				await updateUser(user)
				throw APIResponse.Success()
			}
			else{
				throw APIResponse.MissingRequiredParameters()
			}
		}
		else{
			const user = await APIUtility.getUser(req)
			verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.RHP])
			if(user.permissionLevel === UserPermissionLevel.RHP){
				if(("firstName" in req.body || "lastName" in req.body || "house" in req.body || "floorId" in req.body)){
					const modifiedUser = await getUser(req.body.id)
					if("firstName" in req.body){
						modifiedUser.firstName = APIUtility.parseInputForString(req.body,'firstName')
					}
					if("lastName" in req.body){
						modifiedUser.lastName = APIUtility.parseInputForString(req.body,'lastName')
					}
					if("house" in req.body ){
						const houseId = APIUtility.parseInputForString(req.body, 'house')
						if(houseId !== modifiedUser.house){
							if("floorId" in req.body){
								//TODO remove the user from the current house
								const house = await getHouseByName(houseId)
								const floorId = APIUtility.parseInputForString(req.body, 'floorId')
								if( house.floorIds.indexOf(floorId) === -1){
									throw APIResponse.InvalidFloorId()
								}
								else{
									await removeUserFromHouse(modifiedUser)
									modifiedUser.house = house.id
									modifiedUser.floorId = floorId
									modifiedUser.semesterPoints = 0
									modifiedUser.totalPoints = 0
								}
								
							}
							else{
								throw APIResponse.InvalidFloorId()
							}
						}
					}
					else if("floorId" in req.body){
						//TODO remove the user from the current house
						const house = await getHouseByName(modifiedUser.house)
						const floorId = APIUtility.parseInputForString(req.body, 'floorId')
						if( house.floorIds.indexOf(floorId) === -1){
							throw APIResponse.InvalidFloorId()
						}
						else{
							modifiedUser.floorId = floorId
						}
					}
					await updateUser(modifiedUser)
					throw APIResponse.Success()
				}
				else{
					throw APIResponse.MissingRequiredParameters()
				}
			}
			else if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
				if(("firstName" in req.body || "lastName" in req.body || "house" in req.body || "floorId" in req.body || "permissionLevel" in req.body || "enabled" in req.body)){
					const modifiedUser = await getUser(req.body.id)
					if("firstName" in req.body){
						modifiedUser.firstName = APIUtility.parseInputForString(req.body,'firstName')
					}
					if("lastName" in req.body){
						modifiedUser.lastName = APIUtility.parseInputForString(req.body,'lastName')
					}
					if("permissionLevel" in req.body){
						modifiedUser.permissionLevel = APIUtility.parseInputForNumber(req.body,'permissionLevel',0,5)
					}
					if("enabled" in req.body){
						modifiedUser.enabled = APIUtility.parseInputForBoolean(req.body, 'enabled')
					}

					if("house" in req.body ){
						const houseId = APIUtility.parseInputForString(req.body, 'house')
						if(houseId !== modifiedUser.house){
							if("floorId" in req.body){
								//TODO remove the user from the current house
								const house = await getHouseByName(houseId)
								const floorId = APIUtility.parseInputForString(req.body, 'floorId')
								if( house.floorIds.indexOf(floorId) === -1){
									throw APIResponse.InvalidFloorId()
								}
								else{
									await removeUserFromHouse(modifiedUser)
									modifiedUser.house = house.id
									modifiedUser.floorId = floorId
									modifiedUser.semesterPoints = 0
									modifiedUser.totalPoints = 0
								}
								
							}
							else{
								throw APIResponse.InvalidFloorId()
							}
						}
					}
					else if("floorId" in req.body){
						//TODO remove the user from the current house
						const house = await getHouseByName(modifiedUser.house)
						const floorId = APIUtility.parseInputForString(req.body, 'floorId')
						if( house.floorIds.indexOf(floorId) === -1){
							throw APIResponse.InvalidFloorId()
						}
						else{
							modifiedUser.floorId = floorId
						}
					}
					await updateUser(modifiedUser)
					throw APIResponse.Success()
				}
				else{
					throw APIResponse.MissingRequiredParameters()
				}
			}
		}
		
	}
	catch (error) {
		console.error("PUT user/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})


export const user_main = functions.https.onRequest(users_main)