import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { getUser } from '../src/GetUser'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import * as RewardFunctions from '../src/RewardFunctions'
import * as ParameterParser from '../src/ParameterParser'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}
const reward_app = express()
const cors = require('cors')
const reward_main = express()
const firestoreTools = require('../firestoreTools')

reward_main.use(reward_app)
reward_app.use(express.json())
reward_app.use(express.urlencoded({ extended: false }))



// competition_main is the object to be exported. export this in index.ts
export const rewards_main = functions.https.onRequest(reward_main)

//setup Cors for cross site requests
reward_app.use(cors({origin:true}))
//Setup firestoreTools to validate user has been 
reward_app.use(firestoreTools.flutterReformat)
reward_app.use(firestoreTools.validateFirebaseIdToken)


/**
 * use param.id. If it exists, then get the reward with that id. Otherwise just get all rewards
 * @param (optional) query.id
 * @throws 401 - Unauthorized
 * @throws 420 - Unknown Reward
 * @throws 500 - ServerError
 */
reward_app.get('/', async (req, res) =>{
    try{
        if(req.query.id && req.query.id !== ""){
            const reward = await RewardFunctions.getRewardById(req.query.id as string)
            res.status(APIResponse.SUCCESS_CODE).send({"rewards":reward})
        }
        else {
            const rewards = await RewardFunctions.getAllRewards()
            res.status(APIResponse.SUCCESS_CODE).send({"rewards":rewards})
        }
    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})


/**
 * Update a reward
 * @param body.id
 * @param body.requiredPPR
 * @param body.downloadURL
 * @param body.name
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 420 - Unknown Reward
 * @throws 422 - Missing Required Parameter
 * @throws 426 - Incorrect Data Format
 * @throws 500 - ServerError
 */
reward_app.put('/', async (req, res) =>{
    try{
        if(req.body === undefined || req.body === null || req.body.id === undefined || req.body.id === "" || 
		! ("name" in req.body || "requiredPPR" in req.body || "downloadURL" in req.body )){
			if(req.body === undefined || req.body === null){
				console.error("Missing body")
				throw APIResponse.MissingRequiredParameters()
			}
			else if(req.body.id === undefined || req.body.id === ""){
				console.error("Missing point type id")
				throw APIResponse.MissingRequiredParameters()
			}
			else{
				console.error("At least one field must have an update")
				throw APIResponse.MissingRequiredParameters()
			}
		}

        const user = await getUser(req["user"]["user_id"])
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const id = ParameterParser.parseInputForString(req.body.id)
        const reward = await RewardFunctions.getRewardById(id)
        if("name" in req.body){
            reward.name = ParameterParser.parseInputForString(req.body.fileName)
        }
        if("requiredPPR" in req.body){
            reward.requiredPPR = ParameterParser.parseInputForNumber(req.body.requiredPPR, 1)
        }
        if("downloadURL" in req.body){
            reward.downloadURL = ParameterParser.parseInputForString(req.body.downloadURL)
        }
        await RewardFunctions.updateReward(reward)
        res.status(APIResponse.SUCCESS_CODE).send(reward)

    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})


/**
 * create a reward
 * @param body.id
 * @param body.requiredPPR
 * @param body.downloadURL
 * @param body.name
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parameter
 * @throws 426 - Incorrect Data Format
 * @throws 470 - Reward already exists
 * @throws 500 - ServerError
 */
reward_app.post('/', async (req, res) =>{
    try{
        if(req.body === undefined || req.body === null || !( "fileName" in req.body && "requiredPPR" in req.body && "downloadURL" in req.body && "name" in req.body )){
			if(req.body === undefined || req.body === null){
				console.error("Missing body")
				throw APIResponse.MissingRequiredParameters()
			}
			else{
				console.error("All fields must be present to create a reward")
				throw APIResponse.MissingRequiredParameters()
			}
		}

        const user = await getUser(req["user"]["user_id"])
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const ppr = ParameterParser.parseInputForNumber(req.body.requiredPPR, 1)
        const name = ParameterParser.parseInputForString(req.body.name)
        const fileName = ParameterParser.parseInputForString(req.body.fileName)
        const downloadURL = ParameterParser.parseInputForString(req.body.downloadURL)
        const reward = await RewardFunctions.createReward(name, fileName, downloadURL,ppr)
        res.status(APIResponse.SUCCESS_CODE).send(reward)
    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})

/**
 * Delete a reward
 * @param  query.id
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 420 - Unknown Reward
 * @throws 500 - ServerError
 */
reward_app.delete('/', async (req, res) =>{
    try{
        if(req.query === undefined || req.query === null || !("id" in req.query)){
			if(req.query === undefined || req.query === null){
				console.error("Missing body")
				throw APIResponse.MissingRequiredParameters()
			}
			else if(!("id" in req.query)){
				console.error("Missing point type id")
				throw APIResponse.MissingRequiredParameters()
			}
			else{
				console.error("Unknown problem in deleting reward")
				throw APIResponse.MissingRequiredParameters()
			}
		}

        const user = await getUser(req["user"]["user_id"])
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const id = ParameterParser.parseInputForString(req.query.id)
        const reward = await RewardFunctions.getRewardById(id)

        await RewardFunctions.deleteReward(reward)
        throw APIResponse.Success()

    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})