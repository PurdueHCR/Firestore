import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import *  as request from 'supertest'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let TITANIUM_RESIDENT_ID = "TITANIUM_RESIDENT_ID"
let PROF_STAFF_ID = "PROF_STAFF"
let RHP_ID = "RHP"
let PRIV_RES_ID = "PRIV_RES"
let FACULTY_ID = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let SUBMIT_EVENT_PATH = "/submitEvent"

let PT_IS_ENABLED_ID = 1
let PT_IS_NOT_ENABLED_ID = 2

let EVENT_WITH_ENABLED_POINT_TYPE = "EVENT_WITH_ENABLED_POINT_TYPE"
let EVENT_WITH_DISABLED_POINTS_TYPE = "EVENT_WITH_DISABLED_POINTS_TYPE"
let FUTURE_EVENT = "FUTURE_EVENT"
let PAST_EVENT = 'PAST_EVENT'

//Test Suite Submit Link
describe('user/submitEvent', async () =>{

    beforeAll(async () => {
        
        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()
        
        //Get the Database for our use
        db = IntegrationMockFactory.getDb()
        
        //Get the User function from the index to test
        user_func = require('../../../src/endpoint_paths/index.ts').user

        //Create House
        await FirestoreDataFactory.setAllHouses(db)

        //Create sample users
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db,TITANIUM_RESIDENT_ID, 0, {floor_id:"6N"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_STAFF_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES_ID, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        //Create Point Types
        await FirestoreDataFactory.setPointType(db, PT_IS_ENABLED_ID, { is_enabled: true, description: "PT_IS_ENABLED_ID", value: 1})
        await FirestoreDataFactory.setPointType(db, PT_IS_NOT_ENABLED_ID, { is_enabled: false, description: "PT_IS_NOT_ENABLED_ID", value: 1})
    
        const startDate = new Date()
        startDate.setFullYear(startDate.getFullYear()-2)

        const endDate = new Date()
        endDate.setFullYear(endDate.getFullYear()+2)

        const futureStartDate = new Date()
        futureStartDate.setFullYear(futureStartDate.getFullYear()+1)
        const futureEndDate = new Date()
        futureEndDate.setFullYear(futureStartDate.getFullYear()+2)

        const pastStartDate = new Date()
        pastStartDate.setFullYear(pastStartDate.getFullYear()-2)
        const pastEndDate = new Date()
        pastEndDate.setFullYear(pastEndDate.getFullYear()-1)

        //Create links
        await FirestoreDataFactory.setEvent(db, EVENT_WITH_ENABLED_POINT_TYPE,RHP_ID,{pointTypeId:PT_IS_ENABLED_ID, startDate:startDate, endDate:endDate})
        await FirestoreDataFactory.setEvent(db, EVENT_WITH_DISABLED_POINTS_TYPE,RHP_ID,{pointTypeId:PT_IS_NOT_ENABLED_ID, startDate:startDate, endDate:endDate})
        await FirestoreDataFactory.setEvent(db, FUTURE_EVENT,RHP_ID,{pointTypeId:PT_IS_ENABLED_ID, startDate:futureStartDate, endDate:futureEndDate})
        await FirestoreDataFactory.setEvent(db, PAST_EVENT,RHP_ID,{pointTypeId:PT_IS_ENABLED_ID, startDate:pastStartDate, endDate:pastEndDate})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })


    /**
     * Test if link id is missing
     */
    it('Missing Event Id in body results in error', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"something":"something"}, RESIDENT_ID)
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


    /**
     * Test invalid Event id
     */
    it('Invalid Event Id results in error', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":"invalid id"}, RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(450)
                done()
            }
        })
    })

    /**
     * Test if point type is disabled
     */
    it('Disabled Point Type results in error', async(done) => {
        // Choose a point type that is disabled
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_DISABLED_POINTS_TYPE}, RESIDENT_ID)
        res.end(function (err, res) {
            if (err) {
                done(err)
            }
            else {
                expect(res.status).toBe(418)
                done()
            }
        })
    })

    /**
     * Test if user is proffessional staff and it fails
     */
    it('Test Prof staff fails', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, PROF_STAFF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    /**
     * Test faculty fails
     */
    it('Test faculty fails', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, FACULTY_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    /**
     * Test external advisor fails
     */
    it('Test external advisor fails', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, EA_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    // Test competition disabled
    it('Competition Disabled',  async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(412)
                await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
                done()
            }
        })
    })

    // Test competition disabled
    it('Submission Occurrs before allowed timeframe',  async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":FUTURE_EVENT}, RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(429)
                done()
            }
        })
    })

    // Test competition disabled
    it('Submission Occurrs after allowed timeframe',  async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":PAST_EVENT}, RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(429)
                done()
            }
        })
    })
    
    // Test resident success
    it('Resident submission results in success', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
        const eventCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(-1 * PT_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentId).toEqual(RESIDENT_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)
                const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
                expect(newLength).toEqual(originalLength + 1)
                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.status)
                const newCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
                expect(newCount).toBe(eventCount + 1)
                done()
                
                
            }
        })
    })

    // Test RHP success
    it('RHP submission results in pre approved success', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RHP_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
        const eventCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeDefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(PT_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(0)
                expect(documents.docs[0].data().ResidentId).toEqual(RHP_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)
                const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
                expect(newLength).toEqual(originalLength + 1)
                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RHP_ID)
                expect(newPointStatus.status).toEqual(originalPointStatus.offset(1))
                const newCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
                expect(newCount).toBe(eventCount + 1)
                done()
                
                
            }
        })
    })

    // Test resubmissions
    it('Duplicate submission results in error', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, PRIV_RES_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",PRIV_RES_ID).get()).docs.length
        const eventCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, PRIV_RES_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(-1 * PT_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentId).toEqual(PRIV_RES_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)
                
                const res2: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, PRIV_RES_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(409)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",PRIV_RES_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 1)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, PRIV_RES_ID)
                        expect(newPointStatus.status).toEqual(originalPointStatus.status)
                        const newCount = (await db.collection("Events").doc(EVENT_WITH_ENABLED_POINT_TYPE).get()).data()!["claimedCount"]
                        expect(newCount).toBe(eventCount + 1)
                        done()
                    }
                })
                
            }
        })
    })
    
    // Test submit for event you can't attend
    it('Submission for non invited event results in error', async(done) =>{
        const res: request.Test = factory.post(user_func, SUBMIT_EVENT_PATH, {"eventId":EVENT_WITH_ENABLED_POINT_TYPE}, TITANIUM_RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(432)
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
