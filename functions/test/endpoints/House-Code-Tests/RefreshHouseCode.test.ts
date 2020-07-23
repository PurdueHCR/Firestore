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

        await FirestoreDataFactory.setHouseCode(db, "2NResident", {code:"OLDCODE", code_name:"2N Resident", floor_id:"2N", house:"Copper", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "2SResident", {code:"OLDCODE", code_name:"2S Resident", floor_id:"2S", house:"Copper", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "3NResident", {code:"OLDCODE", code_name:"3N Resident", floor_id:"3N", house:"Palladium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "3SResident", {code:"OLDCODE", code_name:"3S Resident", floor_id:"3S", house:"Palladium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "4NResident", {code:"OLDCODE", code_name:"4N Resident", floor_id:"4N", house:"Platinum", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "4SResident", {code:"OLDCODE", code_name:"4S Resident", floor_id:"4S", house:"Platinum", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "5NResident", {code:"OLDCODE", code_name:"5N Resident", floor_id:"5N", house:"Silver", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "5SResident", {code:"OLDCODE", code_name:"5S Resident", floor_id:"5S", house:"Silver", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "6NResident", {code:"OLDCODE", code_name:"6N Resident", floor_id:"6N", house:"Titanium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "6SResident", {code:"OLDCODE", code_name:"6S Resident", floor_id:"6S", house:"Titanium", permission_level:0})

        await FirestoreDataFactory.setHouseCode(db, "2NRHP", {code:"OLDCODE", code_name:"2N RHP", floor_id:"2N", house:"Copper", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "2SRHP", {code:"OLDCODE", code_name:"2S RHP", floor_id:"2S", house:"Copper", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "3NRHP", {code:"OLDCODE", code_name:"3N RHP", floor_id:"3N", house:"Palladium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "3SRHP", {code:"OLDCODE", code_name:"3S RHP", floor_id:"3S", house:"Palladium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "4NRHP", {code:"OLDCODE", code_name:"4N RHP", floor_id:"4N", house:"Platinum", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "4SRHP", {code:"OLDCODE", code_name:"4S RHP", floor_id:"4S", house:"Platinum", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "5NRHP", {code:"OLDCODE", code_name:"5N RHP", floor_id:"5N", house:"Silver", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "5SRHP", {code:"OLDCODE", code_name:"5S RHP", floor_id:"5S", house:"Silver", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "6NRHP", {code:"OLDCODE", code_name:"6N RHP", floor_id:"6N", house:"Titanium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "6SRHP", {code:"OLDCODE", code_name:"6S RHP", floor_id:"6S", house:"Titanium", permission_level:1})

        await FirestoreDataFactory.setHouseCode(db, "PROFST", {code:"OLDCODE", code_name: "Professional Staff", permission_level:2})

        await FirestoreDataFactory.setHouseCode(db, "CPFHP1", {code:"OLDCODE", code_name:"Copper FHP", house:"Copper", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "PDFHP1", {code:"OLDCODE", code_name:"Palladium RHP", house:"Palladium", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "PTFHP1", {code:"OLDCODE", code_name:"Platinum RHP", house:"Platinum", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "SIFHP1", {code:"OLDCODE", code_name:"Silver RHP", house:"Silver", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "TIFHP1", {code:"OLDCODE", code_name:"Titanium RHP", house:"Titanium", permission_level:3})

        await FirestoreDataFactory.setHouseCode(db, "2NPRIV", {code:"OLDCODE", code_name:"2N PRIV", floor_id:"2N", house:"Copper", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "2SPRIV", {code:"OLDCODE", code_name:"2S PRIV", floor_id:"2S", house:"Copper", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "3NPRIV", {code:"OLDCODE", code_name:"3N PRIV", floor_id:"3N", house:"Palladium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "3SPRIV", {code:"OLDCODE", code_name:"3S PRIV", floor_id:"3S", house:"Palladium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "4NPRIV", {code:"OLDCODE", code_name:"4N PRIV", floor_id:"4N", house:"Platinum", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "4SPRIV", {code:"OLDCODE", code_name:"4S PRIV", floor_id:"4S", house:"Platinum", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "5NPRIV", {code:"OLDCODE", code_name:"5N PRIV", floor_id:"5N", house:"Silver", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "5SPRIV", {code:"OLDCODE", code_name:"5S PRIV", floor_id:"5S", house:"Silver", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "6NPRIV", {code:"OLDCODE", code_name:"6N PRIV", floor_id:"6N", house:"Titanium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "6SPRIV", {code:"OLDCODE", code_name:"6S PRIV", floor_id:"6S", house:"Titanium", permission_level:4})

        await FirestoreDataFactory.setHouseCode(db, "EXTADV", {code:"OLDCODE", code_name: "External Advisor", permission_level:5})

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


