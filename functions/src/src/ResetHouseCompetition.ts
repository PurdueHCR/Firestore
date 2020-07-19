import { APIResponse } from "../models/APIResponse"
import * as functions from 'firebase-functions'
import { getSystemPreferences } from "./GetSystemPreferences";
import { getPointTypes } from "./GetPointTypes";
import { getAllHouses } from "./GetHouses";
import { getAllRewards } from "./GetReward";
import { getHouseCodes } from "./GetHouseCodes";
import { setSystemPreferences } from "./SetSystemPreference";
import { setPointTypes } from "./SetPointTypes";
import { setRewards } from "./SetRewards";
import { setHouses } from "./SetHouses";
import { setHouseCodes } from "./SetHouseCodes";
import { User } from "../models/User";
import { createUserFromModel } from "./CreateUser";


/**
 * Reset the house competition to the defaults. The only user that will be saved is the user who made the request
 * @throws 500 - Server Error 
 */
export async function resetHouseCompetition(user:User){
    var firebase_tools = require("firebase-tools");

    //Retrieve all the objects that should be repopulated
    const systemPreferences = await getSystemPreferences()
    const pointTypes = await getPointTypes()
    const houses = await getAllHouses()
    const rewards = await getAllRewards()
    const houseCodes = await getHouseCodes()
	try {
        await firebase_tools.firestore.delete("/", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: functions.config().fb.token
        });

    }
	catch (err) {
		console.error("Error deleting the comeptition. " + err)
		throw APIResponse.ServerError()
    }

    //Repopulate the models
    await setSystemPreferences(systemPreferences)
    await setPointTypes(pointTypes)
    await setRewards(rewards)
    await setHouses(houses)
    await setHouseCodes(houseCodes)
    await createUserFromModel(user.id, user)

}