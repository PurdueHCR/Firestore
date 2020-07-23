import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let house_codes_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const PROF_ID = "Proffesional_Staff"
const FACULTY = "FACULTY"
const PRIV_RES = "PRIV_RES"
const EA_ID = "EA"

const ENDPOINT = "/refresh"

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('POST house_codes/refresh', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        IntegrationMockFactory.mockDynamicLink()
        db = IntegrationMockFactory.getDb()

        house_codes_func = require('../../../src/endpoint_paths/index.ts').house_codes

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3, {house_name:"Platinum",})
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name:"Platinum", floor_id:"4S"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.createAllHouseCodes(db)

    })

    
    it('Test resident results in Invalid Permission Level', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {}, RESIDENT_ID)
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

    it('Test PRIV resident results in Invalid Permission Level', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {}, PRIV_RES)
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

    it('Test EA results in Invalid Permission Level', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {}, EA_ID)
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
    it('Test fhp results in invalid permission', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {}, FACULTY)
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

    it('Test Prof staff refreshes them all', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, null, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(37)
                for(let code of res.body.house_codes){
                    expect(code.code).toMatch(new RegExp('^((?!OLDCODE).)*$'))
                    expect(code.dynamicLink).toBeDefined()
                }
                done()

            }
        })
    })

    it('Test Prof staff refreshes a single one', async (done) => {
        await FirestoreDataFactory.setHouseCode(db, "2NResident", {code:"OLDCODE", code_name:"2N Resident", floor_id:"2N", house:"Copper", permission_level:0})
        const res = factory.post(house_codes_func, ENDPOINT, {id:"2NResident"}, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(1)
                expect(res.body.house_codes[0].code).toMatch(new RegExp('^((?!OLDCODE).)*$'))
                expect(res.body.house_codes[0].dynamicLink).toBeDefined()
                done()
            }
        })
    })

    it('Test RHP cant refresh all', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {}, RHP_ID)
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

    it('Test RHP can refresh one', async (done) => {
        await FirestoreDataFactory.setHouseCode(db, "4NResident", {code:"OLDCODE", code_name:"4N Resident", floor_id:"4N", house:"Platinum", permission_level:0})
        const res = factory.post(house_codes_func, ENDPOINT, {id:"4NResident"}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(1)
                expect(res.body.house_codes[0].code).toMatch(new RegExp('^((?!OLDCODE).)*$'))
                expect(res.body.house_codes[0].dynamicLink).toBeDefined()
                done()
            }
        })
    })

    it('Test RHP cant refresh one not in its house', async (done) => {
        await FirestoreDataFactory.setHouseCode(db, "2NResident", {code:"OLDCODE", code_name:"2N Resident", floor_id:"2N", house:"Copper", permission_level:0})
        const res = factory.post(house_codes_func, ENDPOINT, {id:"2NResident"}, RHP_ID)
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

    it('Test id doesnt exist', async (done) => {
        const res = factory.post(house_codes_func, ENDPOINT, {id:"asdfas"}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(415)
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


