import { APIResponse } from "../models/APIResponse"
import * as functions from 'firebase-functions'
// import { getSystemPreferences } from "./GetSystemPreferences";
// import { getPointTypes } from "./GetPointTypes";
import { getAllHouses } from "./GetHouses";
// import { getAllRewards } from "./GetReward";
// import { getHouseCodes } from "./GetHouseCodes";
// import { setSystemPreferences } from "./SetSystemPreference";
// import { setPointTypes } from "./SetPointTypes";
// import { setRewards } from "./SetRewards";
import { setHouses } from "./SetHouses";
// import { setHouseCodes } from "./SetHouseCodes";
import { User } from "../models/User";
import { createUserFromModel } from "./CreateUser";
// import { getPointTypes } from "./GetPointTypes";


/**
 * Reset the house competition to the defaults. The only user that will be saved is the user who made the request
 * @throws 500 - Server Error 
 */
export async function resetHouseCompetition(user:User){
    var firebase_tools = require("firebase-tools");

    //Retrieve all the objects that should be repopulated
    const houses = await getAllHouses()
    // const pts = await getPointTypes()

    let fb:{token:string}
        if(functions.config().fb.token === undefined || functions.config().fb.token === ""){
            fb = require('../../development_keys/fb_token.json')
        }
        else{
            fb = functions.config().fb
        }
	try {
        await firebase_tools.firestore.delete("Users", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });
        await firebase_tools.firestore.delete("House", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });
        await firebase_tools.firestore.delete("Links", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });


    }
	catch (err) {
		console.error("Error deleting the comeptition. " + err)
		throw APIResponse.ServerError()
    }

    //Repopulate the models
    await setHouses(houses)
    await createUserFromModel(user.id, user)
    // await setPointTypes(pts)


}