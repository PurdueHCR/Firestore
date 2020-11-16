import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'

let post_event_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let POST_EVENT_PATH = "/"

// Test Suite AddEvent
describe('POST event/', () => {

    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the event function from the index to test
        post_event_func = require('../../../src/endpoint_paths/index.ts').event
    
        // Create sample data for tests
        await FirestoreDataFactory.setAllHouses(db)
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        await FirestoreDataFactory.setPointType(db, 1, {permission_level:3, name:"PT 1"})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit:false, permission_level:1, name:"PT 2"})
        await FirestoreDataFactory.setPointType(db, 3, {is_enabled:false, permission_level:3, name:"PT 3"})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test if no body is provided
    it('Missing Body', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, {}, RHP_ID)
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

    // Test if no name provided
    it('Missing fields', async(done) => {
        const body = {
            "details": "test details"
          }
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no details provided
    it('Bad Date Format', async(done) => {
        const body = createDefaultEventBody()
        body.endDate = "BLAHBLAHBLAH"
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(423)
                done()
            }
        })
    })

    // Test if no date provided
    it('Too Early start Date', async(done) => {
        const body = createDefaultEventBody()
        const date = new Date()
        date.setFullYear(1990)
        body.startDate = date.toISOString()
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(424)
                done()
            }
        })
    })

    // Test if no date provided
    it('End date before start date', async(done) => {
        const body = createDefaultEventBody()
        const date = new Date()
        date.setFullYear(1990)
        body.endDate = date.toISOString()
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(424)
                done()
            }
        })
    })


    // Test incorrect permission point type for RHP
    it('Test incorrect permission point type for RHP', async(done) => {
        let body = createDefaultEventBody()
        body.pointTypeId = 2
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    // Test disabled point type
    it('Test disabled point type', async(done) => {
        let body = createDefaultEventBody()
        body['pointTypeId'] = 3
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(418)
                done()
            }
        })
    })

    // Test permission - resident
    it('Test permission - resident', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), RESIDENT_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    // Test permission - RHP
    it('Test permission - RHP', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.name).toBeDefined()
                expect(res.body.id).toBeDefined()
                expect(res.body.floorColors).toBeDefined()
                expect(res.body.creatorId).toBeDefined()

                done()
            }
        })
    })

    // Test permission - Professional Staff
    it('Test permission - Professional Staff', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), REC_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)

                done()
            }
        })
    })

    // Test permission - faculty
    it('Test permission - faculty', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), FACULTY)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                done()
            }
        })
    })

    // Test permission - priviledged resident
    it('Test permission - priviledged resident', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), PRIV_RES)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                done()
            }
        })
    })

    // Test permission - external advisor
    it('Test permission - external advisor', async(done) => {
        const res: request.Test = factory.post(post_event_func, POST_EVENT_PATH, createDefaultEventBody(), EA_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                done()
            }
        })
    })

    // After all of the tests are done, make sure to delete the test firestore app
    afterAll( async () => {
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })
})

/**
 * Create the body for an event/add post using default parameters
 * 
 * @returns an add event body
 */

function createDefaultEventBody() {
    const startDate = new Date()
    const endDate = new Date()
    startDate.setFullYear(startDate.getFullYear() + 1)
    endDate.setFullYear(startDate.getFullYear() + 2)
    return {
        name: "Test Name",
        details: "Test details",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: "Here",
        pointTypeId:1,
        floorIds:["4N","2N"],
        host:"Host",
        isPublicEvent: false,
        isAllFloors: false
    }
}