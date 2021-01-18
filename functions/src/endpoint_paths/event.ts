import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { createEvent, setAllFloors, setFloors } from '../src/CreateEvent'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUser } from '../src/GetUser'
import { getEvents, getEventsFeed } from '../src/GetEvents'
import { getPointTypeById } from '../src/GetPointTypeById'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getEvent } from '../src/GetEventById'
import { deleteEvent } from '../src/DeleteEvent'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { EventFunctions } from '../src/EventFunctions'
import APIUtility from './APIUtility'

// Made sure that the app is only initialized one time
if (admin.apps.length === 0) {
    admin.initializeApp(functions.config().firebase)
}

const events_app = express()
const cors = require('cors')
const events_main = express()

events_main.use(events_app)
events_app.use(express.json())
events_app.use(express.urlencoded({ extended: true }))

const firestoreTools = require('../firestoreTools')
export const event_main = functions.https.onRequest(events_main)

events_app.use(cors({ origin:true }))
events_app.use(firestoreTools.flutterReformat)
events_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Add an Event
 * 
 * @param name event name
 * @param details event details
 * @param startDate event start date
 * @param endDate event end date
 * @param location event location string
 * @param point_type_id id of the PointType associated with the event
 * @param host event host
 * @param isPublicEvent boolean for can people not in the house competition see this event
 * @param isAllFloors boolean shortcut to make this available to everyone in the house competition
 * 
 * @throws 403 - Invalid Permission Level
 * @throws 412 - Competition Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 422 - Missing Required Parameters
 * @throws 423 - Invalid Date Format
 * @throws 424 - Date Not In Range
 * @throws 430 - Insufficient Permission Level For Create a Link with that Point Type
 * @throws 500 - Server Error
 */
events_app.post('/', async (req, res) => {

    try{
        APIUtility.validateRequest(req)

        const user = await getUser(req["user"]["user_id"])
        const valid_users = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.EXTERNAL_ADVISOR,
                                UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.FACULTY]
        verifyUserHasCorrectPermission(user, valid_users)

        const minDate = new Date()
        minDate.setHours(0,0,0,0)
        

        //Check for fields
        const name = APIUtility.parseInputForString(req.body, 'name')
        const details = APIUtility.parseInputForString(req.body, 'details')
        const startDate = APIUtility.parseInputForDate(req.body, 'startDate', minDate)
        const endDate = APIUtility.parseInputForDate(req.body, 'endDate', startDate)
        const location = APIUtility.parseInputForString(req.body, 'location')
        const pointTypeId = APIUtility.parseInputForNumber(req.body, 'pointTypeId')
        const host = APIUtility.parseInputForString(req.body, 'host')
        const isPublicEvent = APIUtility.parseInputForBoolean(req.body, 'isPublicEvent')
        const isAllFloors = APIUtility.parseInputForBoolean(req.body, 'isAllFloors')
        const floorIds = isAllFloors?(await getSystemPreferences()).floorIds : APIUtility.parseInputForArray(req.body, 'floorIds')
        const pointType = await getPointTypeById(pointTypeId)
        const event = await createEvent(user, name, details, startDate, endDate, location, pointType, floorIds, host, isPublicEvent, isAllFloors)
        res.status(APIResponse.SUCCESS_CODE).json(event)

    } catch (error) {
        console.error("POST event/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
    }
})

/**
 * Update the event 
 * 
 * @throws 400 - Non Existant User
 * @throws 401 - Unauthorized
 * @throws 417 - Unknown Point Type Id
 * @throws 422 - Missing Required Parameter
 * @throws 423 - Invalid Date Format
 * @throws 424 - Date not in range
 * @throws 426 - Incorrect Format
 * @throws 430 - Insufficient Point Type Permission For Link
 * @throws 432 - Can Not Access Event
 * @throws 450 - Non-Existant Event
 * @thrwos 500 - Server Error
 */
events_app.put('/', async(req, res) => {
    try{
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        const id = APIUtility.parseInputForString(req.body, 'id')
        const event = await getEvent(id)
        const minDate = new Date()
        minDate.setHours(0,0,0,0)
        if(event.creatorId !== user.id){
            throw APIResponse.CanNotAccessEvent()
        }
        if('name' in req.body){
            event.name = APIUtility.parseInputForString(req.body, 'name')
        }
        if('details' in req.body){
            event.details = APIUtility.parseInputForString(req.body, 'details')
        }
        if('startDate' in req.body){
            event.startDate = APIUtility.parseInputForDate(req.body,'startDate', minDate)
        }
        if('endDate' in req.body){
            event.endDate = APIUtility.parseInputForDate(req.body, 'endDate', event.startDate)
        }
        if('location' in req.body){
            event.location = APIUtility.parseInputForString(req.body, 'location')
        }
        if('pointTypeId' in req.body){
            const pointTypeId = APIUtility.parseInputForNumber(req.body, 'pointTypeId')
            const pointType = await getPointTypeById(pointTypeId)
            if(pointType.canUserGenerateLinks(user.permissionLevel)){
                event.pointTypeDescription = pointType.description
                event.pointTypeId = pointType.id
                event.pointTypeName = pointType.name
                event.points = pointType.value
            }
            else{
                throw APIResponse.InsufficientPointTypePermissionForLink()
            }
        }

        if('host' in req.body){
            event.host = APIUtility.parseInputForString(req.body, 'host')
        }
        
        if('isPublicEvent' in req.body){
            event.isPublicEvent = APIUtility.parseInputForBoolean(req.body, 'isPublicEvent')
            if(event.isPublicEvent && 'floorIds' in req.body){
                throw APIResponse.IncorrectFormat('If isPublicEvent is set to true, floorIds can not be provided') 
            }
            else{
                //Add all floors
                await setAllFloors(event)
            }
        }
        else if('isAllFloors' in req.body){
            const isAllFloors = APIUtility.parseInputForBoolean(req.body, 'isAllFloors')
            //Add all floors
            if(isAllFloors){
                await setAllFloors(event)
            }
            else if(! ('floorIds' in req.body)){
                throw APIResponse.IncorrectFormat('If isAllFloors is set to False, floorIds must be provided.')
            }
        }
        if('floorIds' in req.body){
            if(event.isPublicEvent){
                throw APIResponse.IncorrectFormat('If isPublicEvent is set to true, floorIds can not be provided') 
            }
            else{
                const floorIds = APIUtility.parseInputForArray(req.body, 'floorIds')
                //Fix floor colors
                await setFloors(event,floorIds)
            }
        }
        console.log(event)
        await EventFunctions.updateEvent(event)
        res.status(APIResponse.SUCCESS_CODE).json(event)
    } 
    catch (error) {
        console.error("PUT event/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
    }
})

/**
 * Get all events available to the user
 * 
 * @throws 400 - Non Existant User
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parameter
 * @throws 499 - Invalid Content Type
 * @throws 500 - Server Error
 */
events_app.get('/', async (req, res) => {

    try {
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.FACULTY, UserPermissionLevel.EXTERNAL_ADVISOR])
        const event_logs = await getEvents(user)
        res.status(APIResponse.SUCCESS_CODE).json({events:event_logs})
    } catch (error) {
        console.error("GET event/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
    }
})

/**
 * Get all events available to the user
 * 
 * @throws 500 - Server Error
 */
events_app.get('/feed', async (req, res) => {

    try {
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        const event_logs = await getEventsFeed(user)
        res.status(APIResponse.SUCCESS_CODE).json({events:event_logs})
    } catch (error) {
        console.log("GET event/feed failed with: " + error)
		APIUtility.handleError(res, error)
    }
})

/**
 * Delete event with the provided Id
 * @params eventId
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 420 - Unknown Reward
 * @throws 422 - MissingRequiredParameter
 * @throws 432 - Can Not Access Event
 * @throws 450 - Non-ExistantEvent
 * @throws 500 - ServerError
 */
events_app.delete('/:eventId', async (req, res) => {
    try {
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        const eventId = APIUtility.parseInputForString(req.params, 'eventId')
        const event = await getEvent(eventId)
        if(event.creatorId === user.id){
            await deleteEvent(event)
            throw APIResponse.Success()
        }
        else{
            throw APIResponse.CanNotAccessEvent()
        }
    } catch (error) {
        console.error("DELETE event/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
    }
})
