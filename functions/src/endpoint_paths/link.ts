import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import {Link} from '../models/Link';
import { HouseCompetition } from '../models/HouseCompetition';
import { PointType } from '../models/PointType';
import { User } from '../models/User';


if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}
const db = admin.firestore();
const links_app = express();
const cors = require('cors');
const links_main = express();

links_main.use(links_app);
links_app.use(express.json());
links_app.use(express.urlencoded({ extended: false }));

const firestoreTools = require('../firestoreTools');

export const link_main = functions.https.onRequest(links_main);

links_app.use(cors({origin:true}));
links_app.use(firestoreTools.flutterReformat)
links_app.use(firestoreTools.validateFirebaseIdToken);

/**
 * Given a GET call to /link/getLink?id=XXXXXXX,
 *    use the id parameter to retrive and send that link
 */
links_main.get('/getLink', (req, res) => {

    if(req.query.id === null){
        res.status(422).send("{\"message\": \"Missing required fields\"}");
    }
    else{
        db.collection(HouseCompetition.LINKS_KEY).doc(req.query.id as string).get().then(linkDoc =>{
            if(linkDoc.exists){
                const link = Link.fromSnapshotDocument(linkDoc);
                res.status(200).send(link.toFirebaseJson())
            }
            else{
                res.status(400).send("{\"message\": \"Could not find link\"}");
            }
        })
        .catch( err => {
            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
        })
    }

    //TODO
    /*
        1. Ensure that the query parameter exists
        2. Using the value in the query parameter, get the link model in the database
        3. Cast the document into the API Link Model
        4. Send the document in the response
        5. On unable to find, send 400
        6. On server error, send 500
    */


})

/**
 * 
 */
links_main.post('/create' ,(req, res) => {

    if(req.body["single_use"] === undefined || req.body["point_id"] === undefined || req.body["description"] === undefined){
		res.status(422).send("{\"message\": \"Missing required parameters.\"}")
    }
    else{
        const blank_id = "";
        const is_enabled = false;
        const is_archived = false;
        const user_id = req["user"]["user_id"];
        const description = req.body["description"];
        const point_id = parseInt(req.body["point_id"]);
        const is_single_use = req.body["single_use"];

        db.collection(HouseCompetition.USERS_KEY).doc(req["user"]["user_id"]).get().then(userDoc => {
            const user = User.fromDocumentSnapshot(userDoc);
            db.collection(HouseCompetition.POINT_TYPES_KEY).doc(point_id.toString()).get().then(pointDoc => {
                if(pointDoc.exists){
                    const pointType = PointType.fromDocumentSnapshot(pointDoc);
                    if(pointType.userCanGenerateQRCodes(user.permissionLevel)){
                        const link = new Link(blank_id,is_archived,user_id, description, is_enabled, point_id, is_single_use);
                        db.collection(HouseCompetition.LINKS_KEY).add(link.toFirebaseJson()).then(ref => {
                            res.status(200).send("{\"message\": \"Success\"}");
                        })
                        .catch( err => {
                            console.log("Could not create link: "+err)
                            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
                        })
                    }
                    else{
                        console.log("Invalid permissions. Point Type: "+pointType.name+", pt_permission: "+pointType.permissionLevel+", usr_permission: "+user.permissionLevel)
                        res.status(412).send("{\"message\": \"Invalid Permission.\"}");
                    }
                }
                else{
                    console.log("Could not find Point Type Id")
                    res.status(417).send("{\"message\": \"Could not find Point Type Id.\"}");
                }
                
            })
            .catch( err => {
                console.log("Could not get point type: "+err)
                res.status(500).send("{\"message\": \"Unknown Server Error\"}");
            })
        })
        .catch( err => {
            console.log("Could not get user: "+err)
            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
        })

        
    }
})

/**
 * 
 */
links_main.post('/update' ,(req, res) => {

    //Ensure that the link id exists so that it can be updated
    if(req.body["link_id"] === undefined ){
		res.status(422).send("{\"message\": \"Missing Link Id\"}");
    }
    else{
        //Get the current data for the link. We need this to potentially update the point type
        db.collection(HouseCompetition.LINKS_KEY).doc(req.body["link_id"]).get().then(linkDoc =>{
            const link = Link.fromSnapshotDocument(linkDoc)

            //Check to ensure that the link is owned by the updating user
            if(link.creatorId !== req["user"]["user_id"]){
                res.status(418).send("{\"message\": \"Link is not owned by current user.\"}")
            }
            else{
                console.log("CREATPR ID: "+link.creatorId);
                console.log("user id: "+req["user"]["user_id"])
                //Get the user
                db.collection(HouseCompetition.USERS_KEY).doc(req["user"]["user_id"]).get().then(userDoc => {
                    link.updateLinkFromData(req.body)

                    const user = User.fromDocumentSnapshot(userDoc);
                    //If the point id key exists, check permissions for point type
                    if("point_id" in req.body){
                        console.log("Must Update Point Id: "+req.body["point_id"])
                        db.collection(HouseCompetition.POINT_TYPES_KEY).doc(req.body["point_id"].toString()).get().then(pointDoc => {
                            console.log("Got From Point Id")
                            if(pointDoc.exists){
                                console.log("Exists")
                                const pointType = PointType.fromDocumentSnapshot(pointDoc);
                                if(pointType.userCanGenerateQRCodes(user.permissionLevel)){
                                    db.collection(HouseCompetition.LINKS_KEY).doc(req.body["link_id"]).set(link.toFirebaseJson()).then(ref => {
                                        res.status(200).send("{\"message\": \"Success\"}");
                                    })
                                    .catch( err => {
                                        console.log("Could not set link: "+err)
                                        res.status(500).send("{\"message\": \"Unknown Server Error\"}");
                                    })
                                }
                                else{
                                    res.status(412).send("{\"message\": \"Invalid Permission.\"}");
                                }
                            }
                            else{
                                res.status(417).send("{\"message\": \"Could not find Point Type Id.\"}");
                            }
                            
                        })
                        .catch( err => {
                            console.log("Could not get point type inner: "+err)
                            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
                        })
                    }
                    else{
                        console.log("We here")
                        //User doesnt need to update point type
                        db.collection(HouseCompetition.LINKS_KEY).doc(req.body["link_id"]).set(link.toFirebaseJson()).then(ref => {
                            res.status(200).send("{\"message\": \"Success\"}");
                        })
                        .catch( err => {
                            console.log("Could not update link after: "+err)
                            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
                        })
                    }
                    
                })
                .catch( err => {
                    console.log("Could not get user here: "+err)
                    res.status(500).send("{\"message\": \"Unknown Server Error\"}");
                })
            }
        })
        .catch( err => {
            console.log("Could not get link initial: "+err)
            res.status(500).send("{\"message\": \"Unknown Server Error\"}");
        })

    }
        
})