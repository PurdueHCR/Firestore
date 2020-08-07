import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'
// import { APIResponse } from '../../../src/models/APIResponse'
import { EVENT_DEFAULTS } from '../../OptionDeclarations'

let get_events_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let GET_EVENTS_PATH = "/get_by_creator_id"

// Test Suite GetEventsByCreatorId
describe('event/get_by_creator_id', () => {
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
        
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME)

        await FirestoreDataFactory.setEvent(db, "1", RHP_ID, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "2", REC_ID, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "3", FACULTY, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "4", PRIV_RES, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "5", EA_ID, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "6", REC_ID, EVENT_DEFAULTS)
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test Resident
    it('Test Resident', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, RHP_ID, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.length).toBeUndefined()
                done()
            }
        })
    })

    // Test RHP
    it('Test RHP', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, RHP_ID, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(Object.keys(res.body["events"]).length).toBe(1)
                expect(res.body["events"][0].creator_id).toBe(RHP_ID)
                done()
            }
        })
    })

    // Test Faculty
    it('Test Faculty', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, FACULTY, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(Object.keys(res.body["events"]).length).toBe(1)
                expect(res.body["events"][0].creator_id).toBe(FACULTY)
                done()
            }
        })
    })

    // Test Privileged Resident
    it('Test Privileged Resident', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, PRIV_RES, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(Object.keys(res.body["events"]).length).toBe(1)
                expect(res.body["events"][0].creator_id).toBe(PRIV_RES)
                done()
            }
        })
    })

    // Test EA
    it('Test EA', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, EA_ID, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(Object.keys(res.body["events"]).length).toBe(1)
                expect(res.body["events"][0].creator_id).toBe(EA_ID)
                done()
            }
        })
    })

    // Test Staff
    it('Test Staff', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, REC_ID, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(Object.keys(res.body["events"]).length).toBe(2)
                expect(res.body["events"][0].creator_id).toBe(REC_ID)
                expect(res.body["events"][1].creator_id).toBe(REC_ID)
                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})