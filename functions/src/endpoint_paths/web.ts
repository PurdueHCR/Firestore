/**
 * Created By Brian Johncox 8/6/2020
 * 
 * This endpoint route is used by the flutter web app to quickly retrieve information for initializing its pages
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { User } from '../models/User'
import { SystemPreference } from '../models/SystemPreference'
import { House } from '../models/House'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { getAllHouses, getHouseByName } from '../src/GetHouses'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getResidentProfile, getRHPProfile, getProfessionalStaffProfile, getExternalAdvisorProfile, getFacultyProfile } from '../src/GetUserProfiles'
import APIUtility from './APIUtility'


if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const web_controls_app = express()
const cors = require('cors')
const web_controls_main = express()

web_controls_main.use(web_controls_app)
web_controls_app.use(express.json())
web_controls_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')

export const web_main = functions.https.onRequest(web_controls_main)


web_controls_app.use(cors({origin:true}))
web_controls_app.use(firestoreTools.flutterReformat)
web_controls_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Type for the return object from web/initialization
 */
declare type InitializationData = {
    user?: User,
    settings?: SystemPreference,
    house?: House,
	houses?: House[]
}

/**
 * Gets the user, settings(System Preferences), and house if applicable
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 425 - Unknown House - but if this gets sent, then there is a problem with data consistency on the user
 * @throws 500 - Server Error
 */
web_controls_app.get('/initialization',  async (req, res) => {
    console.log("Running web/initialization")
	try{
		APIUtility.validateRequest(req)
        const initializationData: InitializationData = {}

        initializationData.user = await APIUtility.getUser(req)
        initializationData.settings = await getSystemPreferences()
		initializationData.houses = await getAllHouses()

        //If the user belongs to a house, get the house as well
        if(initializationData.user.house !== undefined && initializationData.user.house !== ""){
            initializationData.house = await getHouseByName(initializationData.user.house)
        }
        
		res.status(APIResponse.SUCCESS_CODE).json(initializationData)
	}
	catch (error){
        console.error('Error in GET web/initialization: '+error.toString())
        APIUtility.handleError(res,error)
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
web_controls_app.get('/userOverview', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)
		if(user.permissionLevel === UserPermissionLevel.RESIDENT){
			const resident_profile = await getResidentProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"resident":resident_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.RHP){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const resident_profile = await getRHPProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"rhp":resident_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const prof_staff_profile = await getProfessionalStaffProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"professional_staff":prof_staff_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.PRIVILEGED_RESIDENT){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const resident_profile = await getResidentProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"privileged_resident":resident_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.FACULTY) {
			const faculty_profile = await getFacultyProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"fhp":faculty_profile})
		}
		else if(user.permissionLevel === UserPermissionLevel.EXTERNAL_ADVISOR){
			//This is sufficient for the first version, but we will eventually want to add more to their home screen
			const external_advisor_profile = await getExternalAdvisorProfile(user)
			res.status(APIResponse.SUCCESS_CODE).json({"ea":external_advisor_profile})
		}
		else{
			console.error("Other user permissions not yet implemented")
			const apiResponse = APIResponse.InvalidPermissionLevel()
            res.status(apiResponse.code).json(apiResponse.toJson())
		}
		
	}
	catch (error){
        console.error('Error in GET web/userOverview: '+error.toString())
        APIUtility.handleError(res,error)
	}
})