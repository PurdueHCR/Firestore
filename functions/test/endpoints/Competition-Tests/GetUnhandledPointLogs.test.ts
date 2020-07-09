import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let comp_func
const RESIDENT_ID = "RESIDENT_GetUnhandledPointLogs"
const RHP_ID = "RHP_GetUnhandledPointLogs"
const PROF_ID = "Proffesional Staff_GetUnhandledPointLogs"
const FHP_ID = "FHP_GetUnhandledPointLogs"
const PRIV_RES = "PRIV_RES_GetUnhandledPointLogs"
const EA = "External Advisor_GetUnhandledPointLogs"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('competition getUnhandled Points', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        comp_func = require('../../../src/endpoint_paths/index.ts').competition

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA, 5)

        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,true)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",PRIV_RES,false)

    })

    //Test residet gets 2 points logs
    it('Get unhandled points with limit 5', (done) => {
        const res = factory.get(comp_func, "/getUnhandledPoints?limit=5", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(5)
                done()
            }
        })
    })

    //Test rhp get logs
    it('Get RHP', (done) => {
        const res = factory.get(comp_func, "/getUnhandledPoints", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(6)
                done()
            }
        })
    })

    //Test prof staff throws 403
    it('Get Prof Staff', (done) =>{
        const res = factory.get(comp_func, "/getUnhandledPoints", PROF_ID)
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

    //Test fhp throws 403
    it('Get FHP', (done) =>{
        const res = factory.get(comp_func, "/getUnhandledPoints", FHP_ID)
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

    //Test that it priv res gets points
    it('Get Priv Res', (done) =>{
        const res = factory.get(comp_func, "/getUnhandledPoints", PRIV_RES)
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

    //Test that EA throws 403
    it('Get EA', (done) =>{
        const res = factory.get(comp_func, "/getUnhandledPoints", EA)
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

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


