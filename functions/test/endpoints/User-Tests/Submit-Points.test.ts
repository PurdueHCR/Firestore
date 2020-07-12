import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import *  as request from 'supertest'
import {FirestoreDataFactory} from '../FirestoreDataFactory'


let user_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FACULTY = "FACULTY"
let EA_ID = "EA_ID"
let HOUSE_NAME = "Platinum"
let HOUSE_CODE = "4N1234"
let SUBMIT_POINTS_PATH = "/submitPoint"

//Test Suite Submit Points
describe('user/submitpoint', async () =>{

    beforeAll(async () => {
        firebase.apps().map(app => app.delete())
        
        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()
        
        //Get the Database for our use
        db = IntegrationMockFactory.getDb()
        
        //Get the User function from the index to test
        user_func = require('../../../src/endpoint_paths/index.ts').user

        //Create sample data for the tests
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        await FirestoreDataFactory.setPointType(db, 1)
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: false})
        await FirestoreDataFactory.setPointType(db, 3, {is_enabled:false})
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME)
        await FirestoreDataFactory.setHouseCode(db, HOUSE_CODE)
    })

    beforeEach(async () => {
        await FirestoreDataFactory.setSystemPreference(db)
    })

    //Test if no body is provided
    it('Missing Body', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, {}, RESIDENT_ID)
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

    //Test if date is missing
    it('Missing Date Occured', async(done) => {
        const body = {"point_type_id":1, "description":"test"}
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, body, RESIDENT_ID)
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

    //Test if description is missing
    it('Missing Description', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, {"point_type_id":1, "date_occurred":"4/1/2020"}, RESIDENT_ID)
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
     * Test if point type id is missing
     */
    it('Missing Point Type Id', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, {"date_occurred":"4/1/2020", "description":"test"}, RESIDENT_ID)
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
     * Test if point type is invalid
     */
    it('Invalid Point Type', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(0,"test",( new Date()).toString()), RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(417)
                done()
            }
        })
    })

    /**
     * Test if point type is disabled
     */
    it('Disabled Point Type', async(done) => {
        // Choose a point type that is disabled
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(3,"test",( new Date()).toString()), RESIDENT_ID)
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
     * Test if user is not resident or 
     */
    it('Invalid User Permissions', async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,"test",( new Date()).toString()), REC_ID)
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
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,"test",( new Date()).toString()), RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(412)
                done()
            }
        })
    })

    // Test if point type had residentCanSubmit = false
    it('Residents Cant Submit',  async(done) => {
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(2,"test",( new Date()).toString()), RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(419)
                done()
            }
        })
    })

    // Test resident success
    it('Resident Submission Success', async(done) =>{
        const date = new Date()
        const descr = "Resident Submission Success test"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,descr,date.toString()), RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)

                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").where("Description","==",descr).limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(new Date(documents.docs[0].data().DateOccurred.seconds)).toBeTruthy()
                expect(documents.docs[0].data().DateSubmitted).toBeTruthy()
                expect(documents.docs[0].data().Description).toEqual(descr)
                expect(documents.docs[0].data().FloorID).toEqual("4N")
                expect(documents.docs[0].data().PointTypeID).toEqual(-1)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentFirstName).toEqual("TEST_FIRST")
                expect(documents.docs[0].data().ResidentId).toEqual(RESIDENT_ID)
                expect(documents.docs[0].data().ResidentLastName).toEqual("TEST_LAST")
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)
                done();
            }
        })
    })

    // Test RHP success
    it('RHP Submission Success', async(done) =>{
        const date = new Date()
        const descr = "RHP Submission Success test"
        const prevScore = 11
        const prevUserPoints = 14
        const semPoints = 4;
        await FirestoreDataFactory.setHouse(db, HOUSE_NAME, {total_points: prevScore})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {total_points: prevUserPoints, semester_points: semPoints, house_name: HOUSE_NAME})

        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,descr,date.toString()), RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)

                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").where('Description','==',descr).limit(1).get()
                expect(documents.docs).toHaveLength(1)
                expect(documents.docs[0].data().ApprovedOn).toBeTruthy()
                expect(documents.docs[0].data().ApprovedBy).toEqual("Preapproved")
                expect(new Date(documents.docs[0].data().DateOccurred.seconds)).toBeTruthy()
                expect(documents.docs[0].data().DateSubmitted).toBeTruthy()
                expect(documents.docs[0].data().Description).toEqual(descr)
                expect(documents.docs[0].data().FloorID).toEqual("4N")
                expect(documents.docs[0].data().PointTypeID).toEqual(1)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentFirstName).toEqual("TEST_FIRST")
                expect(documents.docs[0].data().ResidentId).toEqual(RHP_ID)
                expect(documents.docs[0].data().ResidentLastName).toEqual("TEST_LAST")
                expect(documents.docs[0].data().ResidentNotifications).toEqual(1)

                let houseDoc = await db.collection("House").doc(HOUSE_NAME).get()
                expect(houseDoc.data()!.TotalPoints).toBe(prevScore + 1)

                let userDoc = await db.collection("Users").doc(RHP_ID).get()
                expect(userDoc.data()!.TotalPoints).toBe(prevUserPoints + 1)
                expect(userDoc.data()!.SemesterPoints).toBe(semPoints + 1)

                let messageDocs = await db.collection("House").doc(HOUSE_NAME).collection("Points").doc(documents.docs[0].id).collection("Messages").get()
                expect(messageDocs.docs[0].data().Message).toBe("Preapproved")
                expect(messageDocs.docs[0].data().MessageType).toBe("approve")
                expect(messageDocs.docs[0].data().SenderFirstName).toBe("PurdueHCR")
                expect(messageDocs.docs[0].data().SenderLastName).toBe("")
                expect(messageDocs.docs[0].data().SenderPermissionLevel).toBe(1)

                done();
            }
        })
    })

    // Test priv resident success
    it('Privileged Resident Submission Success', async(done) =>{
        const date = new Date()
        const descr = "Privileged resident Submission Success test"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,descr,date.toString()), PRIV_RES)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)

                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").where("Description","==",descr).limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(new Date(documents.docs[0].data().DateOccurred.seconds)).toBeTruthy()
                expect(documents.docs[0].data().DateSubmitted).toBeTruthy()
                expect(documents.docs[0].data().Description).toEqual(descr)
                expect(documents.docs[0].data().FloorID).toEqual("4N")
                expect(documents.docs[0].data().PointTypeID).toEqual(-1)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentFirstName).toEqual("TEST_FIRST")
                expect(documents.docs[0].data().ResidentId).toEqual(PRIV_RES)
                expect(documents.docs[0].data().ResidentLastName).toEqual("TEST_LAST")
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)
                done();
            }
        })
    })

    // Test priv resident success with documentID provided
    it('Privileged Resident Submission Success with documentID Provided', async(done) => {
        const date = new Date()
        const descr = "Privileged resident Submission Success test"
        console.log(date.toString())
        var docID = PRIV_RES + HOUSE_CODE
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, {"point_type_id":1, "date_occurred":"4/1/2020", "description":"test", "document_id":docID}, PRIV_RES)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)

                let documents = await db.collection("House").doc(HOUSE_NAME).collection("Points").where("Description","==",descr).limit(1).get()
                expect(documents.docs[0].data().ApprovedOn).toBeUndefined()
                expect(new Date(documents.docs[0].data().DateOccurred.seconds)).toBeTruthy()
                expect(documents.docs[0].data().DateSubmitted).toBeTruthy()
                expect(documents.docs[0].data().Description).toEqual(descr)
                expect(documents.docs[0].data().FloorID).toEqual("4N")
                expect(documents.docs[0].data().PointTypeID).toEqual(-1)
                expect(documents.docs[0].data().RHPNotifications).toEqual(1)
                expect(documents.docs[0].data().ResidentFirstName).toEqual("TEST_FIRST")
                expect(documents.docs[0].data().ResidentId).toEqual(PRIV_RES)
                expect(documents.docs[0].data().ResidentLastName).toEqual("TEST_LAST")
                expect(documents.docs[0].data().ResidentNotifications).toEqual(0)
                done();
            }
        })
    })

    // Test FHP failure since FHPs should not be able to submit points
    it('FHP Submission Failure', async(done) =>{
        const date = new Date()
        const descr = "FHP Submission Failure test"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,descr,date.toString()), FACULTY)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done();
            }
        })
    })

    // Test External Advisor failure since they should not be able to submit points
    it('EA Submission Failure', async(done) =>{
        const date = new Date()
        const descr = "EA Submission Failure test"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS_PATH, createPointLogBody(1,descr,date.toString()), EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done();
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})

  /**
   * Create the body for a user/submitPoint post
   * @param id id of point type
   * @param description descripton for point log
   * @param date date occurred
   */
function createPointLogBody(id: number, description: string, date:string){
    return {"point_type_id":id, "description":description, "date_occurred":date}
}