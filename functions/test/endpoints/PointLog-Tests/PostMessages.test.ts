import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'



let db: firebase.firestore.Firestore

let RESIDENT_PLAT = "RESIDENT_PLATINUM_POSTMESSAGES"
let RESIDENT_PLAT_2 = "RESIDENT_PLATINUM_2_POSTMESSAGES"
let RESIDENT_COPP = "RESIDENT_COPPER_POSTMESSAGES"
let REC_ID = "REC_POSTMESSAGES"
let RHP_PLAT_ID = "RHP_PLAT_POSTMESSAGES"
let PRIV_RES = "PRIV_RES_POSTMESSAGES"
let FACULTY = "FACULTY_POSTMESSAGES"
let EA_ID = "EA_ID_POSTMESSAGES"
let PLATINUM_NAME = "Platinum"
let COPPER_NAME = "Copper"

let point_log_func



// Test Suite UpdatePointLogStatus
describe('Post point_log/messages', async ()  => {

    beforeAll(async() => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        // Get the User function from the index to test
        point_log_func = require("../../../src/endpoint_paths/index").point_log

        await FirestoreDataFactory.setAllHouses(db)

        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_PLAT, 0)
        await FirestoreDataFactory.setUser(db, RESIDENT_PLAT_2, 0)
        await FirestoreDataFactory.setUser(db, RESIDENT_COPP, 0)
        await FirestoreDataFactory.setUser(db, RHP_PLAT_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name: PLATINUM_NAME})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RESIDENT_PLAT, false,{id: RESIDENT_PLAT+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RESIDENT_PLAT, false,{id: RESIDENT_PLAT+"_LOG_2"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RESIDENT_PLAT_2, false,{id: RESIDENT_PLAT_2+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, COPPER_NAME, RESIDENT_COPP, false,{id: RESIDENT_COPP+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RHP_PLAT_ID, false,{id: RHP_PLAT_ID+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, PRIV_RES, false,{id: PRIV_RES+"_LOG_1"} )

    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    it('Resident posts message to their log', async(done) => {
        const body = {log_id: RESIDENT_PLAT+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, RESIDENT_PLAT)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                const messages = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_1").collection("Messages").get()
                expect(messages.docs).toHaveLength(1)
                const pointlog = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_1").get()
                console.log(pointlog.data()!)
                expect(pointlog.data()!.RHPNotifications).toBe(1)
                done()
            }
        })
    })

    it('Resident posts message to a log they dont own results in CanNotAccessPointLog', async(done) => {
        const body = {"log_id": RESIDENT_PLAT+"_LOG_1", "message":"Test message"}
        const res = factory.post(point_log_func, "/messages", body, RESIDENT_PLAT_2)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(431)
                done()
            }
        })
    })

    it('Resident posts to log that doesnt exist reults in Unknown Point Log', async(done) => {
        const body = {log_id: RESIDENT_PLAT+"_Lasdfasdfasdfasfasdf", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, RESIDENT_PLAT)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    it('RHP Posts to point log in the house', async(done) => {
        const body = {log_id: RESIDENT_PLAT+"_LOG_2", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, RHP_PLAT_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                const messages = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_2").collection("Messages").get()
                expect(messages.docs).toHaveLength(1)
                const pointlog = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_2").get()
                expect(pointlog.data()!.ResidentNotifications).toBe(1)
                done()
            }
        })
    })

    it('RHP Posts to point log in another house results in CanNotAccessPointLog', async(done) => {
        const body = {log_id: RESIDENT_COPP+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, RHP_PLAT_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    it.skip('Proffesional staff cant post message', async(done) => {
        const body = {log_id: RESIDENT_COPP+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, REC_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('FHP cant post message', async(done) => {
        const body = {log_id: RESIDENT_COPP+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, FACULTY)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('Priv resident can post message to their log', async(done) => {
        const body = {log_id: PRIV_RES+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, PRIV_RES)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                const messages = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_1").collection("Messages").get()
                expect(messages.docs).toHaveLength(1)
                const pointlog = await db.collection("House").doc("Platinum").collection("Points").doc(RESIDENT_PLAT+"_LOG_1").get()
                expect(pointlog.data()!.RHPNotifications).toBe(1)
                done()
            }
        })
    })

    it('Priv resident post message to a log not nowned results in CanNotAccessPointLog', async(done) => {
        const body = {log_id: RESIDENT_PLAT_2+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, PRIV_RES)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(431)
                done()
            }
        })
    })

    it('EA cant post message', async(done) => {
        const body = {log_id: RESIDENT_COPP+"_LOG_1", message:"Test message"}
        const res = factory.post(point_log_func, "/messages", body, EA_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
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