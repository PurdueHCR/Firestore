// import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
// import * as request from 'supertest'
//import {FirestoreDataFactory, POINT_LOG_DEFAULTS} from '../FirestoreDataFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'


// let point_log_func
let db: firebase.firestore.Firestore
//let accepted_log
//let rejected_log

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let HOUSE_CODE = "4N1234"
//  let HANDLE_POINT_PATH = "/handle"

// Test Suite UpdatePointLogStatus
describe('point_log/handle', async ()  => {

    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the User function from the index to test
        //point_log_func = require('../../../src/endpoint_paths/index.ts').point_log

        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        await FirestoreDataFactory.setPointType(db, 1)
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: false})
        await FirestoreDataFactory.setPointType(db, 3, {is_enabled:false})
        //accepted_log = await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, true, POINT_LOG_DEFAULTS)
        // Not sure that this is actually set to rejected. Not sure it has the denied string
        //rejected_log = await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, false, POINT_LOG_DEFAULTS)
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE)
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test if no body is provided
    it('Missing Body', async(done) => {
        done()
        // const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, {}, RHP_ID)
        // res.end(function (err, res) {
        //     if(err){
        //         done(err)
        //     }
        //     else{
        //         expect(res.status).toBe(422)
        //         done()
        //     }
        // })  
    })

    // Test if approve is missing
    // it('Missing approve', async(done) => {
    //     const body = {"approver_id": RHP_ID, "document_id": accepted_log}
    //     const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
    //     res.end(function (err, res) {
    //         if (err) {
    //             done(err)
    //         } else {
    //             expect(res.status).toBe(422)
    //             done()
    //         }
    //     })
    // })

    // Test if approve is not a boolean
    // it('approve not boolean', async(done) => {
    //     const body = {"approve":"random", "approver_id": RHP_ID, "document_id": accepted_log}
    //     const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
    //     res.end(function (err, res) {
    //         if (err) {
    //             done(err)
    //         } else {
    //             expect(res.status).toBe(422)
    //             done()
    //         }
    //     })
    // })

    // Test if approver_id is missing

    // Test if approver_id cannot be found

    // Test if approver has incorrect permissions

    // Test if document_id is missing
    
    // Test if document_id cannot be found
    
    // Test approve when currently rejected
    // it('Approve when rejected', async(done) => {
    //     const body = {"approve":"true", "approver_id": RHP_ID, "document_id": rejected_log}
    //     const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
    //     res.end(function (err, res) {
    //         if (err) {
    //             done(err)
    //         } else {
    //             expect(res.status).toBe(200)
    //             done()
    //         }
    //     })
    // })
    
    // Test approve when currently approved

    // Test reject when currently approved
    
    // Test reject when currently rejected

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })
    
})