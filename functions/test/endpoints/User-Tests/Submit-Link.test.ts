import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import *  as request from 'supertest'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let PROF_STAFF_ID = "PROF_STAFF"
let RHP_ID = "RHP"
let PRIV_RES_ID = "PRIV_RES"
let FACULTY_ID = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let SUBMIT_LINK_PATH = "/submitLink"

let PT_CAN_SUBMIT_AND_IS_ENABLED_ID = 1
let PT_CAN_SUBMIT_AND_IS_NOT_ENABLED_ID = 2
let PT_CANT_SUBMIT_AND_IS_ENABLED_ID = 3

let LINK_WITH_DISABLED_POINTS_ID = "LINK_WITH_DISABLED_POINTS_ID"
let LINK_WITH_PT_RESIDENTS_CANT_SUBMIT = "LINK_WITH_PT_RESIDENTS_CANT_SUBMIT"
let SINGLE_USE_LINK = "SINGLE_USE_LINK"
let MULTI_USE_LINK = "MULTI_USE_LINK"

//Test Suite Submit Link
describe('user/submitLink', async () =>{

    beforeAll(async () => {
        
        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()
        
        //Get the Database for our use
        db = IntegrationMockFactory.getDb()
        
        //Get the User function from the index to test
        user_func = require('../../../src/endpoint_paths/index.ts').user

        //Create sample users
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_STAFF_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES_ID, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        //Create House
        await FirestoreDataFactory.setHouse(db,HOUSE_NAME)

        //Create Point Types
        await FirestoreDataFactory.setPointType(db, PT_CAN_SUBMIT_AND_IS_ENABLED_ID, {residents_can_submit: true, is_enabled: true, description: "PT_CAN_SUBMIT_AND_IS_ENABLED_ID", value: 1})
        await FirestoreDataFactory.setPointType(db, PT_CAN_SUBMIT_AND_IS_NOT_ENABLED_ID, {residents_can_submit: true, is_enabled: false, description: "PT_CAN_SUBMIT_AND_IS_NOT_ENABLED_ID", value: 1})
        await FirestoreDataFactory.setPointType(db, PT_CANT_SUBMIT_AND_IS_ENABLED_ID, {residents_can_submit: false, is_enabled: true, description: "PT_CANT_SUBMIT_AND_IS_ENABLED_ID", value: 1})
    
        //Create links
        await FirestoreDataFactory.setLink(db, LINK_WITH_DISABLED_POINTS_ID, EA_ID, PT_CAN_SUBMIT_AND_IS_NOT_ENABLED_ID,{single_use: false, enabled: true})
        await FirestoreDataFactory.setLink(db, SINGLE_USE_LINK, EA_ID, PT_CAN_SUBMIT_AND_IS_ENABLED_ID,{single_use: true, enabled: true})
        await FirestoreDataFactory.setLink(db, MULTI_USE_LINK, EA_ID, PT_CAN_SUBMIT_AND_IS_ENABLED_ID,{single_use: false, enabled: true})
        await FirestoreDataFactory.setLink(db, LINK_WITH_PT_RESIDENTS_CANT_SUBMIT, EA_ID, PT_CANT_SUBMIT_AND_IS_ENABLED_ID, {single_use: false, enabled: true})
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    //Test if no body is provided
    it('Missing Body', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {}, RESIDENT_ID)
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
     * Test if link id is missing
     */
    it('Missing link Id', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"something":"something"}, RESIDENT_ID)
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
     * Test if user does not exist
     */
    it('User does not exist', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, "Unknown ID")
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(400)
                done()
            }
        })
    })


    /**
     * Test invalid link id
     */
    it('Invalid Link Id', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":"invalid id"}, RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(408)
                done()
            }
        })
    })

    /**
     * Test if point type is disabled
     */
    it('Disabled Point Type', async(done) => {
        // Choose a point type that is disabled
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":LINK_WITH_DISABLED_POINTS_ID}, RESIDENT_ID)
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
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, PROF_STAFF_ID)
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
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, FACULTY_ID)
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
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, EA_ID)
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
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RESIDENT_ID)
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

    // Test competition hidden
    it('Competition hidden',  async(done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_competition_visible: false})
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                await FirestoreDataFactory.setSystemPreference(db, {is_competition_visible: true})
                done()
            }
        })
    })

    // Test if point type has residentsCantSubmit = false
    it('Point Type has residentsCanSubmit == false',  async(done) => {
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const linkScans = (await db.collection("Links").doc(LINK_WITH_PT_RESIDENTS_CANT_SUBMIT).get()).data()!["ClaimedCount"]
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id": LINK_WITH_PT_RESIDENTS_CANT_SUBMIT}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(-1 * PT_CANT_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentId).toEqual(RESIDENT_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus).toEqual(originalPointStatus)
                const newScans = (await db.collection("Links").doc(LINK_WITH_PT_RESIDENTS_CANT_SUBMIT).get()).data()!["ClaimedCount"]
                expect(newScans).toBe(linkScans + 1)
                done()
            }
        })
    })

    // Test resident success
    it('Resident Submission Success with multi use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(-1 * PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentId).toEqual(RESIDENT_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RESIDENT_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(201)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 2)
                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus)
                        const newScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 2)
                        done()
                    }
                })
                
            }
        })
    })

    // Test resident success
    it.only('Resident Submission Success with single use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeDefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(0)
                expect(documents.docs[0].data().ResidentId).toEqual(RESIDENT_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                console.log(newPointStatus)
                console.log(originalPointStatus)
                expect(newPointStatus).toEqual(originalPointStatus.offset(1))

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, RESIDENT_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(409)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 1)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus.offset(1))
                        const newScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 1)
                        done()
                    }
                })
                
            }
        })
    })

    // Test RHP success
    it('RHP Submission Success with multi use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeDefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(0)
                expect(documents.docs[0].data().ResidentId).toEqual(RHP_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, RHP_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(202)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 2)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus.offset(2))
                        const newScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 2)
                        done()
                    }
                })
                
            }
        })
    })

    // Test RHP success
    it('RHP Submission Success with single use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeDefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(0)
                expect(documents.docs[0].data().ResidentId).toEqual(RHP_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus).toEqual(originalPointStatus.offset(1))
                const newScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
                expect(newScans).toBe(linkScans + 1)

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, RHP_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(409)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RHP_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 1)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus.offset(1))
                        const newScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 1)
                        done()
                    }
                })
                
            }
        })
    })
    
    // Test priv resident success
    it('Privileged Resident Submission Success single use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",PRIV_RES_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, PRIV_RES_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeDefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(0)
                expect(documents.docs[0].data().ResidentId).toEqual(PRIV_RES_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)

                const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                expect(newPointStatus).toEqual(originalPointStatus.offset(1))

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":SINGLE_USE_LINK}, PRIV_RES_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(409)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",RESIDENT_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 1)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus.offset(1))
                        const newScans = (await db.collection("Links").doc(SINGLE_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 1)
                        done()
                    }
                })
                
            }
        })
    })

    // Test priv resident success
    it('Privileged Resident Submission Success multi use', async(done) =>{
        const originalPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
        const originalLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",PRIV_RES_ID).get()).docs.length
        const linkScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
        
        const res: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, PRIV_RES_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)
                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").orderBy("DateSubmitted", "desc").limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(documents.docs[0].data().PointTypeID).toEqual(-1 * PT_CAN_SUBMIT_AND_IS_ENABLED_ID)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentId).toEqual(PRIV_RES_ID)
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)

                const res2: request.Test = factory.post(user_func, SUBMIT_LINK_PATH, {"link_id":MULTI_USE_LINK}, PRIV_RES_ID)
                res2.end(async function (err, res) {
                    if(err){
                        done(err)
                    }
                    else{
                        expect(res.status).toBe(201)
                        const newLength = (await db.collection("House").doc(HOUSE_NAME).collection("Points").where("ResidentId","==",PRIV_RES_ID).get()).docs.length
                        expect(newLength).toEqual(originalLength + 2)

                        const newPointStatus = await FirestoreDataFactory.getCompetitionPointsStatus(db, HOUSE_NAME, RESIDENT_ID)
                        expect(newPointStatus).toEqual(originalPointStatus)
                        const newScans = (await db.collection("Links").doc(MULTI_USE_LINK).get()).data()!["ClaimedCount"]
                        expect(newScans).toBe(linkScans + 2)
                        done()
                    }
                })
                
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})
