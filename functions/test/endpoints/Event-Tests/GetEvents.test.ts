import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'

let get_events_func
let db: firebase.firestore.Firestore

let PLATINUM_RESIDENT = "PLATINUM_RESIDENT"
let PROFESSIONAL_STAFF_ID = "PROFESSIONAL_STAFF_ID"
let COPPER_FHP_ID = "COPPER_FHP"
let PALLADIUM_PRIV_RES = "PALLADIUM_PRIV_RES"
let EA_ID = "EA_ID"
let GET_EVENTS_PATH = "/feed"

// Test Suite GetEvents
describe('GET event/feed', () => {
    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the event function from the index to test
        get_events_func = require('../../../src/endpoint_paths/index.ts').event
    
        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT, 0, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, PROFESSIONAL_STAFF_ID, 2)
        await FirestoreDataFactory.setUser(db, COPPER_FHP_ID, 3, {house_name:"Copper"})
        await FirestoreDataFactory.setUser(db, PALLADIUM_PRIV_RES, 4, {house_name:"Palladium"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        
        await FirestoreDataFactory.setAllHouses(db)

        await FirestoreDataFactory.setEvent(db, "1", PLATINUM_RESIDENT, {floorIds:["4N"]})
        await FirestoreDataFactory.setEvent(db, "2", PLATINUM_RESIDENT, {floorIds:["2N"]})
        await FirestoreDataFactory.setEvent(db, "3", PLATINUM_RESIDENT, {floorIds:["3N"]})
        await FirestoreDataFactory.setEvent(db, "4", PLATINUM_RESIDENT, {floorIds:["2S"]})
        await FirestoreDataFactory.setEvent(db, "ljanskldfjn", PLATINUM_RESIDENT, {floorIds:["2N","2S","3N","3S","4N","4S","5N","5S","6N","6S"], isPublicEvent:true})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test Platinum Resident
    it('Test Platinum Resident', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, PLATINUM_RESIDENT)
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

    // Test Palladium Privileged Resident
    it('Test Palladium Privileged Resident', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, PALLADIUM_PRIV_RES)
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

    // Test Copper FHP
    it('Test Copper FHP', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, COPPER_FHP_ID)
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

    // Test Professional Staff
    it('Test Professional Staff', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, PROFESSIONAL_STAFF_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(4)
                done()
            }
        })
    })

    // Test External Advisor
    it('Test External Advisor', async(done) => {
        const res: request.Test = factory.get(get_events_func, GET_EVENTS_PATH, EA_ID)
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

    

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})
