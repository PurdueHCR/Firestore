import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let link_function
const RESIDENT_ID = "RESIDENT_link_function"
const RHP_ID = "RHP_link_function"
const PROF_ID = "Proffesional Staff_link_function"
const FHP_ID = "FHP_link_function"
const PRIV_RES = "PRIV_RES_link_function"
const EA_ID = "EA_link_function"

let db:firebase.firestore.Firestore

const EMPTY_DESCRIPTION = "Empty Description"
const PROF_ONLY_DESCRIPTION = "Link can only be made with Prof_Staff"
const PROF_RHP_DESCRIPTION =  "Link can only be made with RHP/Prof_Staff"
const ALL_DESCRIPTION = "Link can be made by all"

//Test Suite GetUser
describe('link/create', async () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        IntegrationMockFactory.mockDynamicLink()
        db = IntegrationMockFactory.getDb()

        link_function = require('../../../src/endpoint_paths/index.ts').link

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        //Disabled Point Type
        await FirestoreDataFactory.setPointType(db, 0, {residents_can_submit: true, is_enabled: false, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 1, {residents_can_submit: true, is_enabled: true, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: true, is_enabled: true, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 3, {residents_can_submit: true, is_enabled: true, permission_level: 3})

        await FirestoreDataFactory.setSystemPreference(db)
    })


    test('Point Type Doesnt Exist results in error', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: -1, description: EMPTY_DESCRIPTION, is_enabled: true}, RHP_ID)
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

    test('Point Type Disabled results in error', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 0, description: EMPTY_DESCRIPTION, is_enabled: true}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(418)
                done()
            }
        })
    })
    
    test('Point Type Permissions do not allow creation', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION, is_enabled: true}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 1 is Prof only
    test('RHP can\'t create level 1 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION, is_enabled: true
        }, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 2 is RHP and Prof staff
    test('RHP can create Level 2 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 2, description: PROF_RHP_DESCRIPTION + "RHP", is_enabled: true}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(PROF_RHP_DESCRIPTION + "RHP")
                done()
            }
        })
    })

    //Level 3 is rhp, prof, fhp, priv_res, EA
    test('RHP can create Level 3 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "RHP", is_enabled: true}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "RHP")
                done()
            }
        })
    })

    //Level 1 is Prof only
    test('Prof Staff can create level 1 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION + "PROF", is_enabled: true
        }, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(PROF_ONLY_DESCRIPTION + "PROF")
                done()
            }
        })
    })

    //Level 2 is RHP and Prof staff
    test('PROF can create Level 2 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 2, description: PROF_RHP_DESCRIPTION + "PROF_ID", is_enabled: true}, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(PROF_RHP_DESCRIPTION + "PROF_ID")
                done()
            }
        })
    })

    //Level 3 is rhp, prof, fhp, priv_res, EA
    test('PROF can create Level 3 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "PROF", is_enabled: true}, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "PROF")
                done()
            }
        })
    })

    //Level 1 is Prof only
    test('FHP can\'t create level 1 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION + "FHP", is_enabled: true
        }, FHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 2 is RHP and Prof staff
    test('FHP can create Level 2 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 2, description: PROF_RHP_DESCRIPTION + "FHP", is_enabled: true}, FHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 3 is rhp, prof, fhp, priv_res, EA
    test('FHP can create Level 3 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "FHP_ID", is_enabled: true}, FHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "FHP_ID")
                done()
            }
        })
    })

    //Level 1 is Prof only
    test('Priv res can\'t create level 1 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION + "priv_res", is_enabled: true
        }, PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 2 is RHP and Prof staff
    test('PRIV_RES can create Level 2 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 2, description: PROF_RHP_DESCRIPTION + "PRIV_RES", is_enabled: true}, PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 3 is rhp, prof, fhp, priv_res, EA
    test('PRIV_RES can create Level 3 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "PRIV_RES", is_enabled: true}, PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "PRIV_RES")
                done()
            }
        })
    })

    //Level 1 is Prof only
    test('EA can\'t create level 1 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 1, description: PROF_ONLY_DESCRIPTION + "EA_ID", is_enabled: true
        }, EA_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 2 is RHP and Prof staff
    test('EA can create Level 2 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 2, description: PROF_RHP_DESCRIPTION + "EA_ID", is_enabled: true}, EA_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(430)
                done()
            }
        })
    })

    //Level 3 is rhp, prof, fhp, priv_res, EA
    test('EA can create Level 3 link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "EA_ID", is_enabled: true}, EA_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "EA_ID")
                done()
            }
        })
    })

    test('Resident can\'t create Link', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "RES", is_enabled: true}, RESIDENT_ID)
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

    test('Single User not provided results in missing required parameter error', async (done) => {
        const res = factory.post(link_function, "/create",{ point_id: 3, description: ALL_DESCRIPTION + "RHP", is_enabled: true}, RHP_ID)
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

    test('point type id not provided results in missing required parameter error', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: false, description: ALL_DESCRIPTION + "RHP", is_enabled: true}, RHP_ID)
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

    test('description not provided results in missing required parameter error', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, is_enabled: true}, RHP_ID)
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

    test('User does not exist results in error', async (done) => {
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION, is_enabled: true}, "Invalid Id")
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

    test('Competition hidden and competition disabled do not prevent creation', async (done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false, is_competition_visible: false})
        const res = factory.post(link_function, "/create",{ single_use: true, point_id: 3, description: ALL_DESCRIPTION + "RHP", is_enabled: true}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.description).toBe(ALL_DESCRIPTION + "RHP")
                done()
            }
        })
    })

    afterEach(async ()=> {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true, is_competition_visible: true})
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


