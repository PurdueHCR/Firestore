import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'
import { EVENT_DEFAULTS } from '../../OptionDeclarations'

let get_events_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let PALLADIUM_RESIDENT_ID = "PALLADIUM_RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME_1 = "Platinum"
let HOUSE_CODE_1 = "4N1234"
let HOUSE_NAME_2 = "Palladium"
let HOUSE_CODE_2 = "3N1234"
let GET_EVENTS_PATH = "/get"

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
        await FirestoreDataFactory.setUser(db, PALLADIUM_RESIDENT_ID, 0, {house_name:"Palladium"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_1)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE_1)
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_2)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE_2)

        await FirestoreDataFactory.setEvent(db, "1", RHP_ID, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "2", RHP_ID, {house:"Platinum"})
        await FirestoreDataFactory.setEvent(db, "3", RHP_ID, {house:"Palladium"})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test Palladium Resident
    it('Test Palladium Resident', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, PALLADIUM_RESIDENT_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(2)
                done()
            }
        })
    })

    // Test Resident
    it('Test Platinum Resident', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, RESIDENT_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(2)
                done()
            }
        })
    })

    // Test RHP
    it('Test Platinum Resident', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(2)
                done()
            }
        })
    })

    // Test Professional Staff
    it('Test Professional Staff', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, REC_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(3)
                done()
            }
        })
    })

    // Test External Adivsors
    it('Test External Adivsors', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, EA_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(1)
                done()
            }
        })
    })
    
    // Test Faculty
    it('Test Faculty', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, FACULTY)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(2)
                done()
            }
        })
    })

    // Test Privileged Resident
    it('Test Privileged Resident', async(done) => {
        const res: request.Test = factory.post(get_events_func, GET_EVENTS_PATH, {}, PRIV_RES)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(2)
                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})