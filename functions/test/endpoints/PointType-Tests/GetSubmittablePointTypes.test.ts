import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let pt_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const PRIV_RES = "PRIV_RES"
const PROF_ID = "Proffesional Staff"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('point_types/submittable', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        pt_func = require('../../../src/endpoint_paths/index.ts').point_type

        await FirestoreDataFactory.setAllHouses(db)

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)

        await FirestoreDataFactory.setPointType(db, 1, {residents_can_submit: true, is_enabled: true, permission_level: 1, value: 1})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: true, is_enabled: true, permission_level: 2, value: 2})
        await FirestoreDataFactory.setPointType(db, 3, {residents_can_submit: true, is_enabled: true, permission_level: 3, value: 3})
        await FirestoreDataFactory.setPointType(db, 4, {residents_can_submit: true, is_enabled: false, permission_level: 1, value: 4})
        await FirestoreDataFactory.setPointType(db, 5, {residents_can_submit: true, is_enabled: false, permission_level: 2, value: 5})
        await FirestoreDataFactory.setPointType(db, 6, {residents_can_submit: true, is_enabled: false, permission_level: 3, value: 6})
        await FirestoreDataFactory.setPointType(db, 7, {residents_can_submit: false, is_enabled: true, permission_level: 1, value: 7})
        await FirestoreDataFactory.setPointType(db, 8, {residents_can_submit: false, is_enabled: true, permission_level: 2, value: 8})
        await FirestoreDataFactory.setPointType(db, 9, {residents_can_submit: false, is_enabled: true, permission_level: 3, value: 9})
        await FirestoreDataFactory.setPointType(db, 10, {residents_can_submit: false, is_enabled: false, permission_level: 1, value: 10})
        await FirestoreDataFactory.setPointType(db, 11, {residents_can_submit: false, is_enabled: false, permission_level: 2, value: 11})
        await FirestoreDataFactory.setPointType(db, 12, {residents_can_submit: false, is_enabled: false, permission_level: 3, value: 12})


        await FirestoreDataFactory.setSystemPreference(db)
    })

    //Test non professional staff
    it('Test resident', (done) => {
        const res = factory.get(pt_func, "/submittable", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types[0].id).toBe("1")
                expect(res.body.point_types[1].id).toBe("2")
                expect(res.body.point_types[2].id).toBe("3")
                done()
            }
        })
    })

    //Test professional staff
    it('Test Professional Staff', (done) => {
        const res = factory.get(pt_func, "/submittable", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(0)
                done()
            }
        })
    })

    //Test professional staff
    it('Test Privileged resident', (done) => {
        const res = factory.get(pt_func, "/submittable", PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types[0].id).toBe("1")
                expect(res.body.point_types[1].id).toBe("2")
                expect(res.body.point_types[2].id).toBe("3")
                done()
            }
        })
    })


    //Test Competition Hidden
    it('Competition Hidden and RHP', (done) => {
        const res = factory.get(pt_func, "/submittable", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types[0].id).toBe("1")
                expect(res.body.point_types[1].id).toBe("2")
                expect(res.body.point_types[2].id).toBe("3")
                done()
            }
        })
    })

    afterEach(async ()=> {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
    })

    //After all of the tests are done, make sure to delete the test firestore app
    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


