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
    try{
        let longLink
        if(functions.config().applinks.key === undefined || functions.config().applinks.key === ""){
            longLink = UrlBuilder("https://hcrpoint.page.link", {
                queryParams: {
                    link: "http://localhost:7357/#/"+"addpoints\/"+link.id,
                    ibi: "DecodeProgramming.HCRPoint",
                    apn: "com.hcrpurdue.jason.hcrhousepoints",
                    afl: "http://localhost:7357/#/"+"addpoints/"+link.id,
                    ifl: "http://localhost:7357/#/"+"addpoints/"+link.id,
                    st: link.description,
                    sd: "Tap this link to get "+link.pointTypeValue + (link.pointTypeValue == 1)? " point!": " points!"
                }
            });
        }
        else{
            longLink = UrlBuilder(`${functions.config().applinks.dynamic_link_url}`, {
                queryParams: {
                    link: `${functions.config().applinks.main_app_url}`+"addpoints/"+link.id,
                    ibi: "DecodeProgramming.HCRPoint",
                    apn: "com.hcrpurdue.jason.hcrhousepoints",
                    afl: `${functions.config().applinks.main_app_url}`+"addpoints/"+link.id,
                    ifl: `${functions.config().applinks.main_app_url}`+"addpoints/"+link.id,
                    st: link.description,
                    sd: "Tap this link to get "+link.pointTypeValue + (link.pointTypeValue == 1)? " point!": " points!"
                }
            });
        }

        console.log("LONG LINK: "+longLink)

        let uri
        if(functions.config().applinks.route === undefined || functions.config().applinks.route === ""){
            uri = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyD8iqaRoxfgcdQhyYzsTjFm6uIVkjfBREs`
        }
        else{
            uri = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`
        }
        const options = {
            method: 'POST',
            uri: uri,
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
