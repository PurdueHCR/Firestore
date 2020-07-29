import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP_ID"
const PROF_ID = "Proffesional_id"
const FHP_ID = "FHP_ID"
const PRIV_RES = "Priv_res_id"
const EA_ID = "EA_ID"

const ENDPOINT = "/"
const OTHER_RES = "Other resident"
const OTHER_RES_2 = "Other resident_@"
const OTHER_RES_3 = "Other resident_3"

let db:firebase.firestore.Firestore

declare type UpdateUser = {
    id?:string,
    firstName?:string,
    lastName?:string,
    floorId?:string,
    house?:string,
    permissionLevel?:number,
    enabled?: boolean
}

//Test Suite GetUser
describe('PUT user/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {first:"RESIDENT_FIRST", last:"RESIDENT_LAST", floor_id:"4N",house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {first:"RHP_FIRST", last:"RHP_LAST", floor_id:"4N",house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2, {first:"FIRST_PROFESSION", last:"PROFESS_Last"})
        await FirestoreDataFactory.setUser(db, FHP_ID, 3, {first:"RHP_FIRST", last:"RHP_LAST", floor_id:"4N",house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setAllHouses(db, {copper:{floor_ids:["2N","2S"]}, palladium:{floor_ids:["3N", "3S"]}, platinum:{floor_ids:["4N","4S"]}, silver:{floor_ids:["5N","5S"]}, titanium:{floor_ids:["6N","6S"]}})

        await FirestoreDataFactory.setUser(db, OTHER_RES, 0, {first:"OTHER_RESIDENT_FIRST", last:"OTHER_RESIDENT_LAST", floor_id:"4N",house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, OTHER_RES_2, 0, {first:"OTHER__2RESIDENT_FIRST", last:"OTHER_2_RESIDENT_LAST", floor_id:"4N",house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, OTHER_RES_3, 0, {first:"OTHER__3RESIDENT_FIRST", last:"OTHER_3_RESIDENT_LAST", floor_id:"4N",house_name:"Platinum", total_points: 10, semester_points:10})

        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", OTHER_RES, "OTHER_RESIDENT_FIRST", "OTHER_RESIDENT_LAST", 0,0)
        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", OTHER_RES_2, "OTHER__2RESIDENT_FIRST", "OTHER_2_RESIDENT_LAST", 0,0)
        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", OTHER_RES_3, "OTHER__3RESIDENT_FIRST", "OTHER_3_RESIDENT_LAST", 10,10)

    })
    
    it('Test resident only updates first and last name of themselves', (done) => {
        const body:UpdateUser = { firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(RESIDENT_ID).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user.House).toBe("Platinum")
                expect(user["Permission Level"]).toBe(0)
                expect(user.FloorID).toBe("4N")
                expect(user.Enabled).toBe(true)

                const userRankDoc = (await db.collection("House").doc("Platinum").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const userScore = userRankDoc[RESIDENT_ID]
                expect(userScore.firstName).toBe("NEW_FIRST")
                expect(userScore.lastName).toBe("NEW_LAST")
                done()
            }
        })
    })

    it('Test rhp can updates first and last name of themselves', (done) => {
        const body:UpdateUser = { firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(RHP_ID).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user.House).toBe("Platinum")
                expect(user["Permission Level"]).toBe(1)
                expect(user.FloorID).toBe("4N")
                expect(user.Enabled).toBe(true)

                const userRankDoc = (await db.collection("House").doc("Platinum").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const userScore = userRankDoc[RHP_ID]
                expect(userScore.firstName).toBe("NEW_FIRST")
                expect(userScore.lastName).toBe("NEW_LAST")

                done()
            }
        })
    })

    it('Test PROFessional staff can updates first and last name of themselves', (done) => {
        const body:UpdateUser = { firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(PROF_ID).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user["Permission Level"]).toBe(2)
                expect(user.Enabled).toBe(true)
                done()
            }
        })
    })

    it('Test fhp can updates first and last name of themselves', (done) => {
        const body:UpdateUser = { firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, FHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(FHP_ID).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user["Permission Level"]).toBe(3)
                expect(user.House).toBe("Platinum")
                expect(user.Enabled).toBe(true)
                done()
            }
        })
    })


    it('Test priv resident only updates first and last name of themselves', (done) => {
        const body:UpdateUser = {firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, PRIV_RES)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(PRIV_RES).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user.House).toBe("Platinum")
                expect(user["Permission Level"]).toBe(4)
                expect(user.FloorID).toBe("4N")
                expect(user.Enabled).toBe(true)

                const userRankDoc = (await db.collection("House").doc("Platinum").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const userScore = userRankDoc[PRIV_RES]
                expect(userScore.firstName).toBe("NEW_FIRST")
                expect(userScore.lastName).toBe("NEW_LAST")

                done()
            }
        })
    })

    it('Test EA can updates first and last name of themselves', (done) => {
        const body:UpdateUser = { firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(EA_ID).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user["Permission Level"]).toBe(5)
                expect(user.Enabled).toBe(true)
                done()
            }
        })
    })

    it('Test rhp can updates first, last, house, and floor id of other user', (done) => {
        const body:UpdateUser = {id:OTHER_RES, firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 2, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(OTHER_RES).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user.House).toBe("Copper")
                expect(user["Permission Level"]).toBe(0)
                expect(user.FloorID).toBe("2N")
                expect(user.Enabled).toBe(true)

                const userRankDoc = (await db.collection("House").doc("Copper").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const userScore = userRankDoc[OTHER_RES]
                expect(userScore.firstName).toBe("NEW_FIRST")
                expect(userScore.lastName).toBe("NEW_LAST")

                const platRankDoc = (await db.collection("House").doc("Platinum").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const platUser = platRankDoc[OTHER_RES]
                expect(platUser).toBeUndefined()

                done()
            }
        })
    })

    it('Test PROFessional staff can updates first, last, house, and floor id, permissionLevel, of other user', (done) => {
        const body:UpdateUser = {id:OTHER_RES_2, firstName:"NEW_FIRST", lastName:"NEW_LAST", house:"Copper", floorId:"2N", permissionLevel: 4, enabled: false}
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(OTHER_RES_2).get()).data()!
                expect(user.FirstName).toBe("NEW_FIRST")
                expect(user.LastName).toBe("NEW_LAST")
                expect(user.House).toBe("Copper")
                expect(user["Permission Level"]).toBe(4)
                expect(user.FloorID).toBe("2N")
                expect(user.TotalPoints).toBe(0)
                expect(user.SemesterPoints).toBe(0)
                expect(user.Enabled).toBe(false)

                const userRankDoc = (await db.collection("House").doc("Copper").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const userScore = userRankDoc[OTHER_RES_2]
                expect(userScore.firstName).toBe("NEW_FIRST")
                expect(userScore.lastName).toBe("NEW_LAST")

                const platRankDoc = (await db.collection("House").doc("Platinum").collection("Details").doc("Rank").get()).data()!

                //Confirm tested user
                const platUser = platRankDoc[OTHER_RES_2]
                expect(platUser).toBeUndefined()

                done()
            }
        })
    })

    it('Test PROFessional staff changes only floor id', (done) => {
        const body:UpdateUser = {id:OTHER_RES_3, floorId:"4S"}
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const user = (await db.collection("Users").doc(OTHER_RES_3).get()).data()!
                expect(user.House).toBe("Platinum")
                expect(user.FloorID).toBe("4S")
                expect(user.TotalPoints).toBe(10)
                expect(user.SemesterPoints).toBe(10)
                done()
            }
        })
    })

    it('Floor id does not match house results in Error', (done) => {
        const body:UpdateUser = {id:OTHER_RES_2,  house:"Silver", floorId:"2N"}
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(428)
                done()
            }
        })
    })

    it('Floor id does not exist results in UnknownHouse', (done) => {
        const body:UpdateUser = {id:OTHER_RES_2,  house:"Potato", floorId:"2N"}
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(425)
                done()
            }
        })
    })

    it('Permission level below range', (done) => {
        const body:UpdateUser = {id:OTHER_RES_2, permissionLevel: -1 }
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                done()
            }
        })
    })

    it('Permission level above range', (done) => {
        const body:UpdateUser = {id:OTHER_RES_2, permissionLevel: 6 }
        const res = factory.put(user_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
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


