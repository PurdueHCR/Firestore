import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'



let db: firebase.firestore.Firestore

let RESIDENT_PLAT = "RESIDENT_PLATINUM_GETMESSAGES"
let RESIDENT_PLAT_2 = "RESIDENT_PLATINUM_2_GETMESSAGES"
let RESIDENT_COPP = "RESIDENT_COPPER_GETMESSAGES"
let REC_ID = "REC_GETMESSAGES"
let RHP_PLAT_ID = "RHP_PLAT_GETMESSAGES"
let PRIV_RES = "PRIV_RES_GETMESSAGES"
let FACULTY = "FACULTY_GETMESSAGES"
let EA_ID = "EA_ID_GETMESSAGES"
let PLATINUM_NAME = "Platinum"
let COPPER_NAME = "Copper"

let point_log_func



// Test Suite UpdatePointLogStatus
describe('GET point_log/messages', async ()  => {

    beforeAll(async() => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        // Get the User function from the index to test
        point_log_func = require("../../../src/endpoint_paths/index").point_log

        // Create sample data for tests
        await FirestoreDataFactory.setUser(db, RESIDENT_PLAT, 0)
        await FirestoreDataFactory.setUser(db, RESIDENT_PLAT_2, 0)
        await FirestoreDataFactory.setUser(db, RESIDENT_COPP, 0)
        await FirestoreDataFactory.setUser(db, RHP_PLAT_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name: PLATINUM_NAME})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setHouse(db, PLATINUM_NAME)
        await FirestoreDataFactory.setHouse(db, COPPER_NAME)

        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RESIDENT_PLAT, false,{id: RESIDENT_PLAT+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RESIDENT_PLAT_2, false,{id: RESIDENT_PLAT_2+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, COPPER_NAME, RESIDENT_COPP, false,{id: RESIDENT_COPP+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, RHP_PLAT_ID, false,{id: RHP_PLAT_ID+"_LOG_1"} )
        await FirestoreDataFactory.setPointLog(db, PLATINUM_NAME, PRIV_RES, false,{id: PRIV_RES+"_LOG_1"} )

        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT+"_LOG_1", {message:"Message 1", creation_date: new Date(Date.now() - 3600000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT+"_LOG_1", {message:"Message 2", creation_date: new Date(Date.now() - 1800000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT+"_LOG_1", {message:"Message 3", creation_date: new Date(Date.now() - 900000)})

        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT_2+"_LOG_1", {message:"Message 1", creation_date: new Date(Date.now() - 3600000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT_2+"_LOG_1", {message:"Message 2", creation_date: new Date(Date.now() - 1800000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RESIDENT_PLAT_2+"_LOG_1", {message:"Message 3", creation_date: new Date(Date.now() - 900000)})

        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RHP_PLAT_ID+"_LOG_1", {message:"Message 1", creation_date: new Date(Date.now() - 3600000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RHP_PLAT_ID+"_LOG_1", {message:"Message 2", creation_date: new Date(Date.now() - 1800000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, RHP_PLAT_ID+"_LOG_1", {message:"Message 3", creation_date: new Date(Date.now() - 900000)})

        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, PRIV_RES+"_LOG_1", {message:"Message 1", creation_date: new Date(Date.now() - 3600000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, PRIV_RES+"_LOG_1", {message:"Message 2", creation_date: new Date(Date.now() - 1800000)})
        await FirestoreDataFactory.setPointLogMessage(db, PLATINUM_NAME, PRIV_RES+"_LOG_1", {message:"Message 3", creation_date: new Date(Date.now() - 900000)})


    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    it('Resident gets their own message', async(done) => {
        const query = {"log_id": RESIDENT_PLAT+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RESIDENT_PLAT, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.messages).toHaveLength(3)
                expect(res.body.messages[0].message).toBe("Message 1")
                expect(res.body.messages[1].message).toBe("Message 2")
                expect(res.body.messages[2].message).toBe("Message 3")
                done()
            }
        })
    })

    it('Resident get messages of log not owned by user results in CanNotAccessPointLog error', async(done) => {
        const query = {"log_id": RESIDENT_PLAT_2+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RESIDENT_PLAT, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(431)
                done()
            }
        })
    })

    it('Resident get messages of log not in same house in UnknownPointLog error', async(done) => {
        const query = {"log_id": RESIDENT_COPP+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RESIDENT_PLAT, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    it('Get unknown log results in UnknownPointLog error', async(done) => {
        const query = {"log_id": "UNKNOWN"}
        const res = factory.get(point_log_func, "/messages",RESIDENT_PLAT, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    it('RHP gets messages of log in house', async(done) => {
        const query = {"log_id": RESIDENT_PLAT+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RHP_PLAT_ID, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.messages).toHaveLength(3)
                done()
            }
        })
    })

    it('RHP gets messages of log not in house results in UnknownPointLog error', async(done) => {
        const query = {"log_id": RESIDENT_COPP+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RHP_PLAT_ID, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(413)
                done()
            }
        })
    })

    it('RHP gets own messages', async(done) => {
        const query = {"log_id": RHP_PLAT_ID+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RHP_PLAT_ID, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.messages).toHaveLength(3)
                done()
            }
        })
    })

    it.skip('REC results in Invalid Permissions', async(done) => {
        const query = {"log_id": RESIDENT_PLAT+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",REC_ID, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('Faculty gets messages results in InvalidPermission', async(done) => {
        const query = {"log_id": RESIDENT_COPP+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",FACULTY, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('External Advisor gets messages results in InvalidPermission', async(done) => {
        const query = {"log_id": RESIDENT_COPP+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",EA_ID, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    it('Privilege resident gets their pointlog messages', async(done) => {
        const query = {"log_id": PRIV_RES+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",PRIV_RES, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.messages).toHaveLength(3)
                done()
            }
        })
    })

    it('Test get messages while competition is disabled and hidden', async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false, is_competition_visible: false})
        const query = {"log_id": RESIDENT_PLAT+"_LOG_1"}
        const res = factory.get(point_log_func, "/messages",RESIDENT_PLAT, query)
        res.end(function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(200)
                expect(res.body.messages).toHaveLength(3)
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