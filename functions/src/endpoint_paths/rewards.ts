import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import * as RewardFunctions from '../src/RewardFunctions'
import APIUtility from './APIUtility'

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
        APIUtility.validateRequest(req, true)
        if('id' in req.query){
            const reward = await RewardFunctions.getRewardById(APIUtility.parseInputForString(req.query,'id'))
            res.status(APIResponse.SUCCESS_CODE).json({"rewards":reward})
        }
        else {
            const rewards = await RewardFunctions.getAllRewards()
            res.status(APIResponse.SUCCESS_CODE).json({"rewards":rewards})
        }
    }
    catch (error){
        console.error("GET rewards/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
    }
})


/**
 * Update a reward
 * @param body.id
 * @param body.requiredPPR
 * @param body.downloadURL
 * @param body.name
 * @param body.fileName
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
        APIUtility.validateRequest(req)

        const user = await APIUtility.getUser(req)
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const id = APIUtility.parseInputForString(req.body,'id')
        const reward = await RewardFunctions.getRewardById(id)

        //At least one field must be present to update
        if(!("name" in req.body || "requiredPPR" in req.body || "downloadURL" in req.body || "fileName" in req.body)){
            throw APIResponse.MissingRequiredParameters("At least one field must have an update. [name, requiredPPR, downloadURL, fileName")
		}

        if("name" in req.body){
            reward.name = APIUtility.parseInputForString(req.body,'name')
        }
        if("requiredPPR" in req.body){
            reward.requiredPPR = APIUtility.parseInputForNumber(req.body,'requiredPPR', 1)
        }
        if("downloadURL" in req.body){
            reward.downloadURL = APIUtility.parseInputForString(req.body,'downloadURL')
        }
        if("fileName" in req.body){
            reward.fileName = APIUtility.parseInputForString(req.body,'fileName')
        }
        await RewardFunctions.updateReward(reward)
        throw APIResponse.Success()

    }
    catch (error){
        console.error("POST rewards/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
    }
})


/**
 * create a reward
 * @param body.fileName
 * @param body.requiredPPR
 * @param body.downloadURL
 * @param body.name
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parameter
 * @throws 426 - Incorrect Data Format
 * @throws 500 - ServerError
 */
reward_app.post('/', async (req, res) =>{
    try{
        APIUtility.validateRequest(req)

        const user = await APIUtility.getUser(req)
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const ppr = APIUtility.parseInputForNumber(req.body,'requiredPPR', 1)
        const name = APIUtility.parseInputForString(req.body,'name')
        const fileName = APIUtility.parseInputForString(req.body,'fileName')
        const downloadURL = APIUtility.parseInputForString(req.body,'downloadURL')
        const reward = await RewardFunctions.createReward(name, fileName, downloadURL,ppr)
        res.status(APIResponse.SUCCESS_CODE).send(reward)
    }
    catch (error){
        console.error("POST rewards/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
    }
})

/**
 * Delete a reward
 * @param  body.id
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 420 - Unknown Reward
 * @throws 500 - ServerError
 */
reward_app.delete('/', async (req, res) =>{
    try{
        APIUtility.validateRequest(req)
        const id = APIUtility.parseInputForString(req.body,'id')

        const user = await APIUtility.getUser(req)
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
        const reward = await RewardFunctions.getRewardById(id)

        await RewardFunctions.deleteReward(reward)
        throw APIResponse.Success()

    }
    catch (error){
        console.error("DELETE rewards/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
    }
})