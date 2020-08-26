import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let pt_func
const RESIDENT_ID = "RESIDENT_UPDATE_POINT_TYPE"
const RHP_ID = "RHP_UPDATE_POINT_TYPE"
const PROF_ID = "Proffesional_Staff"
const FHP_ID = "FHP_UPDATE_POINT_TYPE"
const PRIV_RESIDENT_ID = "PRIV_RESIDENT_UPDATE_POINT_TYPE"
const EA_ID = "EA_UPDATE_POINT_TYPE"

const DESCRIPTION = "EMPTY_DESCR"
const ENABLED = true
const NAME = "EMPTY_NAME"
const PERMISSION = 1
const CANSUBMIT= true
const VALUE= 1
let db:firebase.firestore.Firestore

declare type UpdateBody = {
    description?:any,
    enabled?:any,
    name?:any,
    permissionLevel?:any,
    id?:any,
    residentsCanSubmit?:any,
    value?:any
}


//Test Suite GetUser
describe('PUT point_type/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        pt_func = require('../../../src/endpoint_paths/index.ts').point_type

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RESIDENT_ID, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)
        await FirestoreDataFactory.setAllHouses(db, {})
        await FirestoreDataFactory.setSystemPreference(db)

    })

    beforeEach(async () => {
        await FirestoreDataFactory.setPointType(db, 1, {description:DESCRIPTION, is_enabled:ENABLED, name:NAME, permission_level:PERMISSION, residents_can_submit:CANSUBMIT, value:VALUE})
    })

    //Test Competition Disabled
    it('Missing point type id results in Missing REquired Params', async (done) => {
        const body: UpdateBody = {name: "TEST"}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    //Test Competition Disabled
    it('Wrong format for point type id results in Incorrect Format', async (done) => {
        const body: UpdateBody = {id:"ASD", name: "TEST"}
        const res = factory.put(pt_func, "/", body, PROF_ID)
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

    //Test Competition Disabled
    it('Test point type as string', async (done) => {
        const body: UpdateBody = {id:"1", name: "TEST"}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe("TEST")
                done()
            }
        })
    })

    //Test Competition Disabled
    it('Test point type as an invalid id results in invalid ptid', async (done) => {
        const body: UpdateBody = {id:0, name: "TEST"}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(417)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
                done()
            }
        })
    })

    it('Test empty description results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, description: ""}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Description).toBe(DESCRIPTION)
                done()
            }
        })
    })

    it('Test empty enabled results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, enabled: ""}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Enabled).toBe(ENABLED)
                done()
            }
        })
    })

    it('Test empty Permission results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, permissionLevel: ""}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.PermissionLevel).toBe(PERMISSION)
                done()
            }
        })
    })

    it('Test too low Permission results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, permissionLevel: -1}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.PermissionLevel).toBe(PERMISSION)
                done()
            }
        })
    })

    it('Test too low Permission results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, permissionLevel: 5}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.PermissionLevel).toBe(PERMISSION)
                done()
            }
        })
    })

    it('Test empty residentsCanSubmit results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, residentsCanSubmit: ""}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.ResidentsCanSubmit).toBe(CANSUBMIT)
                done()
            }
        })
    })

    it('Test empty value results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, value: ""}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Value).toBe(VALUE)
                done()
            }
        })
    })

    it('Test negative value results in incorrect format', async (done) => {
        const body: UpdateBody = {id:1, value: 0}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Value).toBe(VALUE)
                done()
            }
        })
    })


    it('Test update all fields ', async (done) => {
        const body: UpdateBody = {id:1, description: "UPDATE", enabled: false, name:"NEW_NAME", permissionLevel: 3, residentsCanSubmit: false, value: 10}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Description).toBe("UPDATE")
                expect(pt.Enabled).toBeFalsy()
                expect(pt.Name).toBe("NEW_NAME")
                expect(pt.PermissionLevel).toBe(3)
                expect(pt.ResidentsCanSubmit).toBeFalsy()
                expect(pt.Value).toBe(10)

                const housePointTypeCategory = await db.collection("House").doc("Platinum").collection("Details").doc("PointTypes").get()
                expect(housePointTypeCategory.data()!["1"].name).toBe("NEW_NAME")

                done()
            }
        })
    })

    //Test Competition Disabled
    it('Competition Disabled', async (done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
                done()
            }
        })
    })

    //Test non professional staff
    it('Test Resident results in Invalid Permission', (done) => {
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test RHP results in Invalid Permission', (done) => {
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test FHP results in Invalid Permission', (done) => {
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test Priv Resident results in Invalid Permission', (done) => {
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test EA results in Invalid Permission', (done) => {
        const body: UpdateBody = {id: 1, name: "TEST"}
        const res = factory.put(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt = (await db.collection("PointTypes").doc("1").get()).data()!
                expect(pt.Name).toBe(NAME)
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


