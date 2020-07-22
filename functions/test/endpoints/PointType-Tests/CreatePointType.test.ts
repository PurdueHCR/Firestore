import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let pt_func
const RESIDENT_ID = "RESIDENT_CREATE_POINT_TYPE"
const RHP_ID = "RHP_CREATE_POINT_TYPE"
const PROF_ID = "Proffesional_Staff"
const FHP_ID = "FHP_CREATE_POINT_TYPE"
const PRIV_RESIDENT_ID = "PRIV_RESIDENT_CREATE_POINT_TYPE"
const EA_ID = "EA_CREATE_POINT_TYPE"

const DESCRIPTION = "EMPTY_DESCR"
const ENABLED = true
const NAME = "EMPTY_NAME"
const PERMISSION = 1
const CANSUBMIT= true
const VALUE= 1
let db:firebase.firestore.Firestore

declare type CreateBody = {
    description?:any,
    enabled?:any,
    name?:any,
    permissionLevel?:any,
    residentsCanSubmit?:any,
    value?:any
}

function getDefaults() : CreateBody{
    return {
        description: DESCRIPTION, 
        enabled: ENABLED, 
        name:NAME, 
        permissionLevel:PERMISSION,
        residentsCanSubmit: CANSUBMIT,
        value:VALUE
    }
}


//Test Suite GetUser
describe('point_type/', () =>{

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

    })

    beforeEach(async () => {
        await FirestoreDataFactory.setPointType(db, 1)
    })

    it('Test missing description results in Missing required field', async (done) => {
        const body: CreateBody = getDefaults()
        delete body.description
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test empty description results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.description = ""
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test missing enabled results in Missing required field', async (done) => {
        const body: CreateBody = getDefaults()
        delete body.enabled
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test empty enabled results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.enabled = ""
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })


    it('Test missing permissionLevel results in Missing required field', async (done) => {
        const body: CreateBody = getDefaults()
        delete body.permissionLevel
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test empty permissionLevel results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.permissionLevel = ""
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test too low Permission results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.permissionLevel = 0
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test too high Permission results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.permissionLevel = 4
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test missing residentsCanSubmit results in Missing required field', async (done) => {
        const body: CreateBody = getDefaults()
        delete body.residentsCanSubmit
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test empty residentsCanSubmit results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.residentsCanSubmit = ""
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test missing value results in Missing required field', async (done) => {
        const body: CreateBody = getDefaults()
        delete body.value
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test empty value results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.value = ""
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    it('Test too low value results in incorrect format', async (done) => {
        const body: CreateBody = getDefaults()
        body.value = 0
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })


    it('Test successful create ', async (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                pt_docs.sort((a,b) => (parseInt(a.id) - parseInt(b.id)))
                expect(pt_docs.length).toBe(2)
                expect(pt_docs[1].id).toBe("2")
                expect(pt_docs[1].data().Description).toBe(DESCRIPTION)
                expect(pt_docs[1].data().Enabled).toBe(ENABLED)
                expect(pt_docs[1].data().Name).toBe(NAME)
                expect(pt_docs[1].data().PermissionLevel).toBe(PERMISSION)
                expect(pt_docs[1].data().ResidentsCanSubmit).toBe(CANSUBMIT)
                expect(pt_docs[1].data().Value).toBe(VALUE)
                await db.collection("PointTypes").doc("1").delete()
                await db.collection("PointTypes").doc("2").delete()
                done()
            }
        })
    })

    it('Test gap in points create with correct id', async (done) => {
        await FirestoreDataFactory.setPointType(db, 4)
        await FirestoreDataFactory.setPointType(db, 36)
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                pt_docs.sort((a,b) => (parseInt(a.id) - parseInt(b.id)))
                expect(pt_docs.length).toBe(4)
                expect(pt_docs[3].id).toBe("37")
                expect(pt_docs[3].data().Description).toBe(DESCRIPTION)
                expect(pt_docs[3].data().Enabled).toBe(ENABLED)
                expect(pt_docs[3].data().Name).toBe(NAME)
                expect(pt_docs[3].data().PermissionLevel).toBe(PERMISSION)
                expect(pt_docs[3].data().ResidentsCanSubmit).toBe(CANSUBMIT)
                expect(pt_docs[3].data().Value).toBe(VALUE)
                await db.collection("PointTypes").doc("1").delete()
                await db.collection("PointTypes").doc("4").delete()
                await db.collection("PointTypes").doc("36").delete()
                await db.collection("PointTypes").doc("37").delete()
                done()
            }
        })
    })

    //Test Competition Disabled
    it('Competition Disabled', async (done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                pt_docs.sort((a,b) => (parseInt(a.id) - parseInt(b.id)))
                expect(pt_docs.length).toBe(2)
                expect(pt_docs[1].id).toBe("2")
                expect(pt_docs[1].data().Description).toBe(DESCRIPTION)
                expect(pt_docs[1].data().Enabled).toBe(ENABLED)
                expect(pt_docs[1].data().Name).toBe(NAME)
                expect(pt_docs[1].data().PermissionLevel).toBe(PERMISSION)
                expect(pt_docs[1].data().ResidentsCanSubmit).toBe(CANSUBMIT)
                expect(pt_docs[1].data().Value).toBe(VALUE)
                await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
                await db.collection("PointTypes").doc("1").delete()
                await db.collection("PointTypes").doc("2").delete()
                done()
            }
        })
    })

    //Test non professional staff
    it('Test Resident results in Invalid Permission', (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test RHP results in Invalid Permission', (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test FHP results in Invalid Permission', (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test Priv Resident results in Invalid Permission', (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test EA results in Invalid Permission', (done) => {
        const body: CreateBody = getDefaults()
        const res = factory.post(pt_func, "/", body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const pt_docs = (await db.collection("PointTypes").get()).docs
                expect(pt_docs.length).toBe(1)
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


