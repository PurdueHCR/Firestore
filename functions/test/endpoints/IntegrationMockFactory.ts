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
        firestore.FieldValue = {
            delete: () => firebase.firestore.FieldValue.delete()
        }
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
            firestore: firestore
            
    
        }
    })
    mockConfig()
}

export function mockDynamicLink(){
    jest.mock('request-promise', () => jest.fn(() => {
        return Promise.resolve({shortLink:"https://this_is_a_fake_link"})
    }))
}

export function mockOTCGenerator(){
    jest.mock('otplib', () => {
        return {
            totp: {
                generate: (secret) => "TESTTOKEN",
                check:(token, secret) => {
                    console.log("Checking "+token)
                    if(token === "TESTTOKEN"){
                        return true
                    }
                    else{
                        console.log("Invalid token")
                        return false
                    }
                }
            }
        }
    })
}

export function mockConfig(){
    const test = require('firebase-functions-test')()
    test.mockConfig(
        { 
            otc: { 
            secret:"SUPERDUPERSECRET"
            }, 
            fb: {
                token:"TEST"
            },
            applinks: { 
                main_app_url:"https://main_app_url/%23/", 
                dynamic_link_url: "https://hcrpoint.page.link/", 
                key:"keykeykeykey" 
            },
            email_auth: {
                user: "email",
                pass: "password"
            }
        }
    );
}

let db:firebase.firestore.Firestore

// Helper function to setup the test db instance
export function getDb() {
    if(db){
        return db
    }
    else{
        process.env.GCLOUD_PROJECT = 'test-project'
        return firebase
            .initializeTestApp({ projectId: 'test-project', auth: { uid: "Authorization"} })
            .firestore();
    }
  }