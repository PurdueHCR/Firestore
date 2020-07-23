import * as UrlBuilder from 'build-url'
import * as functions from 'firebase-functions'
import * as request from 'request-promise'
import {Link} from '../models/Link'
import { APIResponse } from '../models/APIResponse';


/**
 * Create a firesbase dynamic link for a link
 * @param link Link to create a dynamic link for
 */
export async function makeDynamicLinkForLink(link:Link): Promise<string> {
    let applinks
    if(functions.config().applinks.key === undefined || functions.config().applinks.key === ""){
        applinks = require('../../development_keys/dynamic_link_keys.json')
    }
    else{
        applinks = functions.config().applinks
    }
    try{
        const longLink = UrlBuilder(`${applinks.dynamic_link_url}`, {
            queryParams: {
                link: `${applinks.main_app_url}`+"addpoints/"+link.id,
                ibi: "DecodeProgramming.HCRPoint",
                apn: "com.hcrpurdue.jason.hcrhousepoints",
                afl: `${applinks.main_app_url}`+"addpoints/"+link.id,
                ifl: `${applinks.main_app_url}`+"addpoints/"+link.id,
                st: link.description,
                sd: "Tap this link to get "+link.pointTypeValue + (link.pointTypeValue === 1)? " point!": " points!"
            }
        });

        console.log("LONG LINK: "+longLink)
        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${applinks.key}`,
            body: {
                "longDynamicLink": longLink,
                "suffix": {
                    "option": "UNGUESSABLE"
                }
            },
            json: true
        };
    
        const response = await request(options)
        console.log("Got response from post dynamic link: "+ response);
        return response.shortLink
    }
    catch (error) {
        console.error("Error creating Dynamic link: "+error)
        return Promise.reject(APIResponse.ServerError())
    }
}
