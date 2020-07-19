import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'

let add_event_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let HOUSE_CODE = "4N1234"
let ADD_EVENT_PATH = "/add"

// Test Suite AddEvent
describe('event/add', () => {

    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the event function from the index to test
        add_event_func = require('../../../src/endpoint_paths/index.ts').event
    
        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE)
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
        await FirestoreDataFactory.cleanEvents(db)
    })

    // Test if no body is provided
    it('Missing Body', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, {}, RHP_ID)
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
    it('Missing name', async(done) => {
        const body = {
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house": "test house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
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
    it('Missing details', async(done) => {
        const body = {
            "name": "test event",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house": "test house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no date provided
    it('Missing date', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house": "test house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no location provided
    it('Missing location', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house": "test house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no points provided
    it('Missing points', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house": "test house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no house provided
    it('Missing house', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "point_type_description":"test type description"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no point_type_id
    it('Missing point_type_id', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_name":"test type name",
            "point_type_description":"test type description",
            "house":"test_house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no point_type_name
    it('Missing point_type_id', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_description":"test type description",
            "house":"test_house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test if no point_type_description
    it('Missing point_type_description', async(done) => {
        const body = {
            "name": "test event",
            "details": "test details",
            "date": "January 1, 2100",
            "location": "test location",
            "points": "5",
            "point_type_id":"1",
            "point_type_name":"test type name",
            "house":"test_house"
          }
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, body, RHP_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test permission - resident
    it('Test permission - resident', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), RESIDENT_ID)
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
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), RHP_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                let doc = await db.collection("Events").where('Name','==','test event').limit(1).get()
                expect(doc.docs[0]).toBeDefined()
                let data = doc.docs[0].data()
                expect(data).toBeDefined()
                expect(data.Name).toBe("test event")
                expect(data.Details).toBe("test details")
                expect(data.Date).toBeDefined()
                expect(data.Location).toBe("test location")
                expect(data.Points).toBe(5)
                expect(data.House).toBe("test house")
                expect(data.CreatorID).toBe(RHP_ID)

                done()
            }
        })
    })

    // Test permission - Professional Staff
    it('Test permission - Professional Staff', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), REC_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                let doc = await db.collection("Events").where('Name','==','test event').limit(1).get()
                expect(doc.docs[0]).toBeDefined()
                let data = doc.docs[0].data()
                expect(data).toBeDefined()
                expect(data.Name).toBe("test event")
                expect(data.Details).toBe("test details")
                expect(data.Date).toBeDefined()
                expect(data.Location).toBe("test location")
                expect(data.Points).toBe(5)
                expect(data.House).toBe("test house")
                expect(data.CreatorID).toBe(REC_ID)
                
                done()
            }
        })
    })

    // Test permission - faculty
    it('Test permission - faculty', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), FACULTY)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                let doc = await db.collection("Events").where('Name','==','test event').limit(1).get()
                expect(doc.docs[0]).toBeDefined()
                let data = doc.docs[0].data()
                expect(data).toBeDefined()
                expect(data.Name).toBe("test event")
                expect(data.Details).toBe("test details")
                expect(data.Date).toBeDefined()
                expect(data.Location).toBe("test location")
                expect(data.Points).toBe(5)
                expect(data.House).toBe("test house")
                expect(data.CreatorID).toBe(FACULTY)
                
                done()
            }
        })
    })

    // Test permission - priviledged resident
    it('Test permission - priviledged resident', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), PRIV_RES)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                let doc = await db.collection("Events").where('Name','==','test event').limit(1).get()
                expect(doc.docs[0]).toBeDefined()
                let data = doc.docs[0].data()
                expect(data).toBeDefined()
                expect(data.Name).toBe("test event")
                expect(data.Details).toBe("test details")
                expect(data.Date).toBeDefined()
                expect(data.Location).toBe("test location")
                expect(data.Points).toBe(5)
                expect(data.House).toBe("test house")
                expect(data.CreatorID).toBe(PRIV_RES)

                done()
            }
        })
    })

    // Test permission - external advisor
    it('Test permission - external advisor', async(done) => {
        const res: request.Test = factory.post(add_event_func, ADD_EVENT_PATH, createDefaultEventBody(), EA_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)

                let doc = await db.collection("Events").where('Name','==','test event').limit(1).get()
                expect(doc.docs[0]).toBeDefined()
                let data = doc.docs[0].data()
                expect(data).toBeDefined()
                expect(data.Name).toBe("test event")
                expect(data.Details).toBe("test details")
                expect(data.Date).toBeDefined()
                expect(data.Location).toBe("test location")
                expect(data.Points).toBe(5)
                expect(data.House).toBe("test house")
                expect(data.CreatorID).toBe(EA_ID)

                done()
            }
        })
    })

    // After all of the tests are done, make sure to delete the test firestore app
    afterAll( () => {
        Promise.all(firebase.apps().map(app => app.delete()))
    })
})

/**
 * Create the body for an event/add post using default parameters
 * 
 * @returns an add event body
 */

function createDefaultEventBody() {
        return {"name":"test event", "details":"test details", "date":"January 1, 2100", "location":"test location",
                "points":5, "point_type_id":1, "point_type_name":"test type name",
                "point_type_description":"test type description", "house":"test house"}
    }