import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'

let get_events_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME_1 = "Platinum"
let HOUSE_CODE_1 = "4N1234"
let HOUSE_NAME_2 = "Palladium"
let HOUSE_CODE_2 = "3N1234"
let ADD_EVENT_PATH = "/get"

// Test Suite GetEvents
describe('event/get', () => {
    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the event function from the index to test
        get_events_func = require('../../../src/endpoint_paths/index.ts').event
    
        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_1)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE_1)
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_2)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE_2)
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })
})