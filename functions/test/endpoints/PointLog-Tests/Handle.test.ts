import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import {FirestoreDataFactory, CompetitionPointStatus} from '../FirestoreDataFactory'
import { POINT_LOG_DEFAULTS } from '../../OptionDeclarations'

let point_log_func
let db: firebase.firestore.Firestore
let approved_log
let unhandled_log
let rejected_log
let point_description

let originalPointStatus: CompetitionPointStatus


let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let HANDLE_POINT_PATH = "/handle"

let PARAM_CHECKS_LOG_ID = "MISC_TESTS_LOG_ID"

let REJECT_LOG_ID = "REJECT_LOG_ID"

let PT_1_DETAILS = "POINT TYPE !"

// Test Suite UpdatePointLogStatus
describe('point_log/handle', async ()  => {

    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the User function from the index to test
        point_log_func = require('../../../src/endpoint_paths/index.ts').point_log

        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        await FirestoreDataFactory.setPointType(db, 1)
        await FirestoreDataFactory.setPointType(db, 1, {description: PT_1_DETAILS, name: PT_1_DETAILS, value: 10})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: false, value: 10})
        await FirestoreDataFactory.setPointType(db, 3, {is_enabled:false, value: 10})
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME)

        await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, false, {id: PARAM_CHECKS_LOG_ID})
        await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, true, {id: REJECT_LOG_ID, description: REJECT_LOG_ID, point_type_id: 1, approved: false})
    })

    beforeEach(async () => {
        let approved_log_ref = await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, false)
        if (approved_log_ref !== null) {
            approved_log = (approved_log_ref as firebase.firestore.DocumentReference)
            point_description = POINT_LOG_DEFAULTS.description!
            approved_log = approved_log.id
        }
        const approve_body = {"approve":true, "point_log_id":approved_log}
        await factory.post(point_log_func, HANDLE_POINT_PATH, approve_body, RHP_ID)

        let rejected_log_ref = await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, false)
        if (rejected_log_ref !== null) {
            rejected_log = (rejected_log_ref as firebase.firestore.DocumentReference).id
        }
        const rejected_body = {"approve":false, "point_log_id":rejected_log}
        await factory.post(point_log_func, HANDLE_POINT_PATH, rejected_body, RHP_ID)

        let unhandled_log_ref = await FirestoreDataFactory.setPointLog(db, HOUSE_NAME, RESIDENT_ID, false)
        if (unhandled_log_ref !== null) {
            unhandled_log = (unhandled_log_ref as firebase.firestore.DocumentReference).id
        }
        originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test if no body is provided
    it('Missing Body', async(done) => {
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, {}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                done()
            }
        })  
    })

    // Test if approve is missing
    it('Missing approve', async(done) => {
        const body = {"point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if approve is not a boolean
    it('approve not boolean', async(done) => {
        const body = {"approve":"random", "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(426)
                done()
            }
        })
    })


    // Test if reject but no message
    it('reject must come with a message', async(done) => {
        const body = {"approve":false, "point_log_id": PARAM_CHECKS_LOG_ID}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if approver has incorrect permissions
    it('approver has incorrect permissions - resident', async(done) => {
        const body = {"approve":true, "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RESIDENT_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('approver has incorrect permissions - rec', async(done) => {
        const body = {"approve":true, "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, REC_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('approver has incorrect permissions - priv res', async(done) => {
        const body = {"approve":true, "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PRIV_RES)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('approver has incorrect permissions - faculty', async(done) => {
        const body = {"approve":true, "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, FACULTY)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('approver has incorrect permissions - ea', async(done) => {
        const body = {"approve":true, "point_log_id": approved_log}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, EA_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    // Test if point_log_id is missing
    it('Missing point_log_id', async(done) => {
        const body = {"approve":true}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if point_log_id cannot be found
    it('invalid point_log_id', async(done) => {
        const body = {"approve":true, "point_log_id":"gibberish"}
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    // Test approve when unhandled
    it('approve when unhandled', async(done) => {
        const body = {"approve":true, "point_log_id":unhandled_log}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.offset(10))
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })

    // Test approve when currently rejected
    it('The log was rejected but now it is being approved', async(done) => {
        const body = {"approve":true, "point_log_id":rejected_log}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.offset(10))
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(rejected_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })
    
    // Test approve when currently approved
    it('approve when already approved', async(done) => {
        const body = {"approve":true, "point_log_id":approved_log}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(416)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(approved_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })

    // Test reject when unhandled
    it('reject when unhandled', async(done) => {
        const body = {"approve":false, "point_log_id":unhandled_log, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toContain("DENIED: ")

                done()
            }
        })
    })

    // Test reject when currently approved
    it('The log was approved but now we are rejecting it', async(done) => {
        const body = {"approve":false, "point_log_id":approved_log, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.offset(-10))
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(approved_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toContain("DENIED: ")

                done()
            }
        })
    })

    // Test reject when currently rejected
    it('reject when already rejected', async(done) => {
        const body = {"approve":false, "point_log_id":REJECT_LOG_ID, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(416)
                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(REJECT_LOG_ID).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(0)
                expect(point_log_doc.data()!.Description).toEqual("DENIED: "+REJECT_LOG_ID)

                done()
            }
        })
    })

    // Test approve when competition disabled
    it('approve when competition disabled', async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled:false})
        const body = {"approve":true, "point_log_id":unhandled_log}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(412)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeLessThan(0)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })

    // Test reject when competition disabled
    it('reject when competition disabled', async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled:false})
        const body = {"approve":false, "point_log_id":unhandled_log, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(412)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)

                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeLessThan(0)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })

    // Test approve when competition hidden
    it('approve when competition hidden', async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_competition_visible:false})
        const body = {"approve":true, "point_log_id":unhandled_log}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.offset(10))
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toEqual(point_description)

                done()
            }
        })
    })

    // Test reject when competition hidden
    it('reject when competition hidden', async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_competition_visible:false})
        const body = {"approve":false, "point_log_id":unhandled_log, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const point_log_doc = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(unhandled_log).get()
                expect(point_log_doc).toBeDefined()
                expect(point_log_doc.data()!).toBeDefined()
                expect(point_log_doc.data()!.ApprovedOn).toBeDefined()
                expect(point_log_doc.data()!.ApprovedBy).toBeDefined()
                expect(point_log_doc.data()!.PointTypeID).toBeGreaterThan(0)
                expect(point_log_doc.data()!.ResidentNotifications).toBe(1)
                expect(point_log_doc.data()!.Description).toContain("DENIED: ")

                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })
    
})