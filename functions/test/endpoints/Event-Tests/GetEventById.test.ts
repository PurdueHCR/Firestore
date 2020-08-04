import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import * as request from 'supertest'
import { FirestoreDataFactory } from '../FirestoreDataFactory'
import { APIResponse } from '../../../src/models/APIResponse'
import { EVENT_DEFAULTS } from '../../OptionDeclarations'

let get_event_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let PALLADIUM_RESIDENT_ID = "PALLADIUM_RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME_1 = "Platinum"
let HOUSE_NAME_2 = "Palladium"
let GET_EVENT_PATH = "/get_by_id"

// Test Suite GetEventById
describe('event/get_by_id', () => {
    beforeAll(async() => {
        firebase.apps().map(app => app.delete())

        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()

        // Get the database for our use
        db = IntegrationMockFactory.getDb()

        // Get the event function from the index to test
        get_event_func = require('../../../src/endpoint_paths/index.ts').event
    
        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, PALLADIUM_RESIDENT_ID, 0, {house_name:"Palladium"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_1)
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME_2)

        await FirestoreDataFactory.setEvent(db, "1", RHP_ID, EVENT_DEFAULTS)
        await FirestoreDataFactory.setEvent(db, "2", RHP_ID, {house:"Platinum"})
        await FirestoreDataFactory.setEvent(db, "3", RHP_ID, {house:"Palladium"})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    // Test Missing Body
    it('Test Missing Body', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PALLADIUM_RESIDENT_ID, {})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    // Test Unknown event_id
    it('Test Unknown event_id', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PALLADIUM_RESIDENT_ID, {event_id:"gibberish"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.NonExistantUser().code)
                done()
            }
        })
    })

    // Test Incorrect Permission Level
    it('Test Incorrect Permission Level', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PALLADIUM_RESIDENT_ID, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.InvalidPermissionLevel().code)
                done()
            }
        })
    })

    // Test Palladium Resident
    it('Test Palladium Resident', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PALLADIUM_RESIDENT_ID, {event_id:"3"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Palladium")
                done()
            }
        })
    })

    // Test Resident
    it('Test Platinum Resident', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, RESIDENT_ID, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Platinum")
                done()
            }
        })
    })

    // Test Get All House Event
    it('Test All House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, RESIDENT_ID, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })

    // Test RHP - All Houses Event
    it('Test RHP - All Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, RHP_ID, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })

    // Test RHP - Incorrect House Event
    it('Test RHP - Incorrect House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, RHP_ID, {event_id:"3"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.InvalidPermissionLevel().code)
                done()
            }
        })
    })

    // Test RHP - House Event
    it('Test RHP - House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, RHP_ID, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Platinum")
                done()
            }
        })
    })

    // Test Professional Staff - All Houses Event
    it('Test Professional Staff - All Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, REC_ID, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })


    // Test Professional Staff - House Event
    it('Test Professional Staff - House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, REC_ID, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Platinum")
                done()
            }
        })
    })

    // Test External Adivsors - All Houses Event
    it('Test External Adivsors - All Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, EA_ID, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })

    // Test External Adivsors - House Event
    it('Test External Adivsors - House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, EA_ID, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.InvalidPermissionLevel().code)
                done()
            }
        })
    })
    
    // Test Faculty - All Houses Event
    it('Test Faculty - All Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, FACULTY, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })

    // Test Faculty - Incorrect House Event
    it('Test Faculty - Incorrect Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, FACULTY, {event_id:"3"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.InvalidPermissionLevel().code)
                done()
            }
        })
    })

    // Test Faculty - House Event
    it('Test Faculty - House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, FACULTY, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Platinum")
                done()
            }
        })
    })

    // Test Privileged Resident - All Houses Event
    it('Test Privileged Resident - All Houses Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PRIV_RES, {event_id:"1"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("All Houses")
                done()
            }
        })
    })

    // Test Privileged Resident - Incorrect House Event
    it('Test Privileged Resident - Incorrect House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PRIV_RES, {event_id:"3"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(APIResponse.InvalidPermissionLevel().code)
                done()
            }
        })
    })

    // Test Privileged Resident - House Event
    it('Test Privileged Resident - House Event', async(done) => {
        const res: request.Test = factory.get(get_event_func, GET_EVENT_PATH, PRIV_RES, {event_id:"2"})
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.data["house"]).toEqual("Platinum")
                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})