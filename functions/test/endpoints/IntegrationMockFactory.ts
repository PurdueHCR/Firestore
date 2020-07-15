import * as firebase from "@firebase/testing"
import * as admin from 'firebase-admin'

/**
 * 
 * @param db Firestore to replace the default with. (For testing, it will usuall come from authedApp())
 */
export function mockFirebaseAdmin(db: firebase.firestore.Firestore = getDb()){
    jest.mock('firebase-admin', () => {
        const firestore = () => {
            return db
        }
        firestore.Timestamp = admin.firestore.Timestamp
    
        return {
            apps: {
                length: 1
            },
        
            auth: () => { 
                return { 
                    verifyIdToken: (token:string) => {
                        if(token === "INVALIDID"){
                            throw Error("Unkown ID Token")
                        }
                        else{
                            return {"user_id":token}
                        }
                        
                    } 
                }
            },
        
            //This mocks admin.initializeApp() so whenever the app calls initializeApp(),
            //it will run jest.fn() which is an empty function
            initializeApp: () => {
                jest.fn()
            },
        
            //Mocks admin.firestore() Which is often saved as db
            firestore: firestore,
    
        }
    })
}

export function mockDynamicLink(){
    jest.mock('request-promise', () => jest.fn(() => {
        return Promise.resolve({shortLink:"https://this_is_a_fake_link"})
    }))
    const test = require('firebase-functions-test')()
    test.mockConfig({ applinks: { main_app_url:"https://main_app_url/%23/", dynamic_link_url: "https://hcrpoint.page.link/", key:"keykeykeykey" }});
}

let db:firebase.firestore.Firestore

// Helper function to setup the test db instance
export function getDb() {
    if(db){
        return db
    }
    else{
        return firebase
            .initializeTestApp({ projectId: 'test-project', auth: { uid: "Authorization"} })
            .firestore();
    }
  }