import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import *  as request from 'supertest'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
let point_log_func
let db: firebase.firestore.Firestore

const PLATINUM_RESIDENT_DONT_GET_DELETED = "PLATINUM_RESIDENT_DONT_GET_DELETED"

const PLATINUM_RESIDENT_1_ID = "PLATINUM_RESIDENT_1_ID"
const PLATINUM_RESIDENT_2_ID = "PLATINUM_RESIDENT_2_ID"
const PLATINUM_RESIDENT_3_ID = "PLATINUM_RESIDENT_3_ID"
const PLATINUM_RESIDENT_4_ID = "PLATINUM_RESIDENT_4_ID"
const PLATINUM_RESIDENT_5_ID = "PLATINUM_RESIDENT_5_ID"
const PLATINUM_RESIDENT_6_ID = "PLATINUM_RESIDENT_6_ID"
const PLATINUM_RESIDENT_7_ID = "PLATINUM_RESIDENT_7_ID"
const PLATINUM_RHP_1_ID = "PLATINUM_RHP_1_ID"
const SUBMIT_POINTS = "/submitPoint"
const HANDLE_POINT_PATH = "/handle"

const COPPER = "Copper"
const PALLADIUM = "Palladium"
const PLATINUM = "Platinum"
const SILVER = "Silver"
const TITANIUM = "Titanium"

const UNHANDLED_TO_APPROVE = "UNHANDLED_TO_APPROVE"
const UNHANDLED_TO_REJECT = "UNHANDLED_TO_REJECT"
const REJECTED_TO_APPROVE = "REJECTED_TO_APPROVE"
const APPROVED_TO_APPROVE = "APPROVED_TO_APPROVE"
const APPROVED_TO_REJECT = "APPROVED_TO_REJECT"
const REJECTED_TO_REJECT = "REJECTED_TO_REJECT"


//Test Suite Submit Points
describe('', async () =>{

    beforeAll(async () => {
        firebase.apps().map(app => app.delete())
        
        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()
        
        //Get the Database for our use
        db = IntegrationMockFactory.getDb()
        
        //Get the User function from the index to test
        user_func = require('../../../src/endpoint_paths/index.ts').user
        //Get the Point Log function from the index to test
        point_log_func = require('../../../src/endpoint_paths/index.ts').point_log


        await FirestoreDataFactory.setSystemPreference(db)

        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_DONT_GET_DELETED, 0, {house_name:PLATINUM, first:"DONT GET", last:"DELETED", total_points:99, semester_points:99})

        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_1_ID, 0, {house_name:PLATINUM})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_2_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"2", total_points:2, semester_points:2})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_3_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"3", total_points:3, semester_points:3})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_4_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"4", total_points:4, semester_points:4})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_5_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"5", total_points:5, semester_points:5})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_6_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"6", total_points:66, semester_points:66})
        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_7_ID, 0, {house_name:PLATINUM, first:"PLATINUM_RES", last:"7", total_points:7, semester_points:7})
        await FirestoreDataFactory.setUser(db, PLATINUM_RHP_1_ID, 1, {house_name:PLATINUM, first:"PLATINUM", last:"RHP_1", total_points:20, semester_points:18})
        await FirestoreDataFactory.setHouse(db, COPPER)
        await FirestoreDataFactory.setHouse(db, PALLADIUM)
        await FirestoreDataFactory.setHouse(db, PLATINUM)
        await FirestoreDataFactory.setHouse(db, SILVER)
        await FirestoreDataFactory.setHouse(db, TITANIUM)

        //Make sure these dont get removed from the list
        await FirestoreDataFactory.setPointType(db, 20, {name:"Point Type Id 20"})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_DONT_GET_DELETED, "DONT GET", "DELETED", 99, 99)
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 20, "Point Type Id 20", 99, 99)


        //Test 1
        await FirestoreDataFactory.setPointType(db, 1, {name:"Point Type Id 1"})
        
        //Test 2
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RHP_1_ID, "PLATINUM", "RHP_1", 20, 18)
        await FirestoreDataFactory.setPointType(db, 2, {name:"Point Type Id 2", value: 10})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 2, "Point Type Id 2", 26, 19)

        //Test 3
        await FirestoreDataFactory.setPointType(db, 3, {name:"Point Type Id 3", value: 20})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_2_ID, "PLATINUM_RES", "2", 2, 2)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_2_ID, false, {id: UNHANDLED_TO_APPROVE, point_type_id: 3})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 3, "Point Type Id 3", 3, 2)
        

        //Test 4
        await FirestoreDataFactory.setPointType(db, 4, {name:"Point Type Id 4", value: 30})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_3_ID, "PLATINUM_RES", "3", 3, 3)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_3_ID, false, {id: UNHANDLED_TO_REJECT, point_type_id: 4})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 4, "Point Type Id 4", 4, 4)
        

        //Test 5
        await FirestoreDataFactory.setPointType(db, 5, {name:"Point Type Id 5", value: 40})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_4_ID, "PLATINUM_RES", "4", 4, 4)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_4_ID, true, {id: REJECTED_TO_APPROVE, point_type_id: 5, approved: false})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 5, "Point Type Id 5", 5, 4)
        

        //Test 6
        await FirestoreDataFactory.setPointType(db, 6, {name:"Point Type Id 6", value: 50})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_5_ID, "PLATINUM_RES", "5", 5, 5)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_5_ID, true, {id: APPROVED_TO_APPROVE, point_type_id: 6, approved: true})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 6, "Point Type Id 6", 6, 6)
        

        //Test 7
        await FirestoreDataFactory.setPointType(db, 7, {name:"Point Type Id 7", value: 60})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_6_ID, "PLATINUM_RES", "6", 66, 66)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_6_ID, true, {id: APPROVED_TO_REJECT, point_type_id: 7, approved: true})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 7, "Point Type Id 7", 7, 7)
        

        //Test 7
        await FirestoreDataFactory.setPointType(db, 8, {name:"Point Type Id 8", value: 70})
        await FirestoreDataFactory.setUserHouseRank(db, PLATINUM, PLATINUM_RESIDENT_7_ID, "PLATINUM_RES", "7", 7, 7)
        await FirestoreDataFactory.setPointLog(db, PLATINUM, PLATINUM_RESIDENT_7_ID, true, {id: REJECTED_TO_REJECT, point_type_id: 8, approved: false})
        await FirestoreDataFactory.setHousePointTypeDetails(db, PLATINUM, 8, "Point Type Id 8", 8, 7)
        

        //Initialize required docs
        // Houses
        // House Details
        // System preferences
        // Users

    })

    it('Test submit new point type without approval adds to only house point types', async(done) =>{
        const date = new Date()
        const descr = "Test submit new point type without approval adds to only house point types"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS, createPointLogBody(1,descr,date.toString()), PLATINUM_RESIDENT_1_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(202)

                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["1"]
                expect(pointType).toBeDefined()
                expect(pointType.submitted).toBe(1)
                expect(pointType.approved).toBe(0)
                expect(pointType.name).toBe("Point Type Id 1")

                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                const userScore = userRankDoc[PLATINUM_RESIDENT_1_ID]
                expect(userScore).toBeUndefined()

                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                
                done()
            }
        })

    })

    it('Test submit existing point type with approval adds to house point types and user rank', async(done) =>{
        const date = new Date()
        const descr = "Test submit existing point type with approval adds to house point types and user rank"
        console.log(date.toString())
        const res: request.Test = factory.post(user_func, SUBMIT_POINTS, createPointLogBody(2,descr,date.toString()), PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(201)

                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["2"]
                expect(pointType).toBeDefined()
                expect(pointType.submitted).toBe(27)
                expect(pointType.approved).toBe(20)
                expect(pointType.name).toBe("Point Type Id 2")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RHP_1_ID]
                expect(userScore.firstName).toBe("PLATINUM")
                expect(userScore.lastName).toBe("RHP_1")
                expect(userScore.totalPoints).toBe(30)
                expect(userScore.semesterPoints).toBe(28)


                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                
                done()
            }
        })
    })

    it('Test approve unhandled point log increments approved and user rank', async(done) =>{
        const body = {"approve":true, "point_log_id":UNHANDLED_TO_APPROVE}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["3"]
                console.log("PT data: "+ JSON.stringify(pointTypeDoc.data()!))
                expect(pointType).toBeDefined()
                expect(pointType.submitted).toBe(3)
                expect(pointType.approved).toBe(3)
                expect(pointType.name).toBe("Point Type Id 3")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_2_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("2")
                expect(userScore.totalPoints).toBe(22)
                expect(userScore.semesterPoints).toBe(22)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

                done()
            }
        })
    })

    it('Test reject unhandled point log maintains point types and user rank', async(done) =>{
        const body = {"approve":false, "point_log_id":UNHANDLED_TO_REJECT, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["4"]
                expect(pointType).toBeDefined()
                //Initial values are 4
                expect(pointType.submitted).toBe(4)
                expect(pointType.approved).toBe(4)
                expect(pointType.name).toBe("Point Type Id 4")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_3_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("3")
                //Initial values are 3
                expect(userScore.totalPoints).toBe(3)
                expect(userScore.semesterPoints).toBe(3)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

                done()
            }
        })
    })

    it('Test approve a previously rejected point log increments approved and user rank', async(done) =>{
        const body = {"approve":true, "point_log_id":REJECTED_TO_APPROVE}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["5"]
                expect(pointType).toBeDefined()
                //Initial values are 5,4
                expect(pointType.submitted).toBe(5)
                expect(pointType.approved).toBe(5)
                expect(pointType.name).toBe("Point Type Id 5")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_4_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("4")
                //Initial values are 4, and pt value is 40
                expect(userScore.totalPoints).toBe(44)
                expect(userScore.semesterPoints).toBe(44)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

                done()
            }
        })
    })

    it('Test approve a previously approved point log maintains approved and user rank', async(done) =>{
        const body = {"approve":true, "point_log_id":APPROVED_TO_APPROVE}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(416)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["6"]
                expect(pointType).toBeDefined()
                //Initial values are 6,6
                expect(pointType.submitted).toBe(6)
                expect(pointType.approved).toBe(6)
                expect(pointType.name).toBe("Point Type Id 6")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_5_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("5")
                //Initial values are 5, and pt value is 50
                expect(userScore.totalPoints).toBe(5)
                expect(userScore.semesterPoints).toBe(5)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

                done()
            }
        })
    })

    it('Test reject a previously approved point log decrements approved and user rank', async(done) =>{
        const body = {"approve":false, "point_log_id":APPROVED_TO_REJECT, "message":"Please give more details"}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(201)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["7"]
                expect(pointType).toBeDefined()
                //Initial values are 7,7
                expect(pointType.submitted).toBe(7)
                expect(pointType.approved).toBe(6)
                expect(pointType.name).toBe("Point Type Id 7")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_6_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("6")
                //Initial values are 66, and pt value is 60
                expect(userScore.totalPoints).toBe(6)
                expect(userScore.semesterPoints).toBe(6)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

                done()
            }
        })
    })

    it('Test reject a previously rejected point log maintains approved and user rank', async(done) =>{
        const body = {"approve":false, "point_log_id":REJECTED_TO_REJECT, message:"Please provide more detail."}
        
        const res: request.Test = factory.post(point_log_func, HANDLE_POINT_PATH, body, PLATINUM_RHP_1_ID)
        res.end(async function (err, res) {
            if (err) {
                done(err)
            } else {
                expect(res.status).toBe(416)
                const pointTypeDoc = await db.collection("House").doc(PLATINUM).collection("Details").doc("PointTypes").get()
                const userRankDoc = (await db.collection("House").doc(PLATINUM).collection("Details").doc("Rank").get()).data()!
                
                //Confirm tested point type
                expect(pointTypeDoc.exists).toBeTruthy()
                const pointType = pointTypeDoc.data()!["8"]
                expect(pointType).toBeDefined()
                //Initial values are 8,7
                expect(pointType.submitted).toBe(8)
                expect(pointType.approved).toBe(7)
                expect(pointType.name).toBe("Point Type Id 8")

                //Confirm tested user
                const userScore = userRankDoc[PLATINUM_RESIDENT_7_ID]
                expect(userScore.firstName).toBe("PLATINUM_RES")
                expect(userScore.lastName).toBe("7")
                //Initial values are 7,7
                expect(userScore.totalPoints).toBe(7)
                expect(userScore.semesterPoints).toBe(7)

                //Confirm preexisting point type and user to make sure they dont get deleted
                const confirmNotDeleted = pointTypeDoc.data()!["20"]
                expect(confirmNotDeleted).toBeDefined()
                expect(confirmNotDeleted.submitted).toBe(99)
                expect(confirmNotDeleted.approved).toBe(99)
                expect(confirmNotDeleted.name).toBe("Point Type Id 20")

                const confirmUserNotDeleted = userRankDoc[PLATINUM_RESIDENT_DONT_GET_DELETED]
                expect(confirmUserNotDeleted.firstName).toBe("DONT GET")
                expect(confirmUserNotDeleted.lastName).toBe("DELETED")
                expect(confirmUserNotDeleted.totalPoints).toBe(99)
                expect(confirmUserNotDeleted.semesterPoints).toBe(99)
                

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

  /**
   * Create the body for a user/submitPoint post
   * @param id id of point type
   * @param description descripton for point log
   * @param date date occurred
   */
function createPointLogBody(id: number, description: string, date:string){
    return {"point_type_id":id, "description":description, "date_occurred":date}
}