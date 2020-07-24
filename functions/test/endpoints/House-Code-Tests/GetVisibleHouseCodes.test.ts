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

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('GET house_codes/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        house_codes_func = require('../../../src/endpoint_paths/index.ts').house_codes

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3, {house_name:"Platinum",})
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name:"Platinum", floor_id:"4S"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setHouseCode(db, "2NResident", {code:"2NResident", code_name:"2N Resident", floor_id:"2N", house:"Copper", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "2SResident", {code:"2SResident", code_name:"2S Resident", floor_id:"2S", house:"Copper", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "3NResident", {code:"3NResident", code_name:"3N Resident", floor_id:"3N", house:"Palladium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "3SResident", {code:"3SResident", code_name:"3S Resident", floor_id:"3S", house:"Palladium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "4NResident", {code:"4NResident", code_name:"4N Resident", floor_id:"4N", house:"Platinum", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "4SResident", {code:"4SResident", code_name:"4S Resident", floor_id:"4S", house:"Platinum", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "5NResident", {code:"5NResident", code_name:"5N Resident", floor_id:"5N", house:"Silver", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "5SResident", {code:"5SResident", code_name:"5S Resident", floor_id:"5S", house:"Silver", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "6NResident", {code:"6NResident", code_name:"6N Resident", floor_id:"6N", house:"Titanium", permission_level:0})
        await FirestoreDataFactory.setHouseCode(db, "6SResident", {code:"6SResident", code_name:"6S Resident", floor_id:"6S", house:"Titanium", permission_level:0})

        await FirestoreDataFactory.setHouseCode(db, "2NRHP", {code:"2NRHP", code_name:"2N RHP", floor_id:"2N", house:"Copper", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "2SRHP", {code:"2SRHP", code_name:"2S RHP", floor_id:"2S", house:"Copper", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "3NRHP", {code:"3NRHP", code_name:"3N RHP", floor_id:"3N", house:"Palladium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "3SRHP", {code:"3SRHP", code_name:"3S RHP", floor_id:"3S", house:"Palladium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "4NRHP", {code:"4NRHP", code_name:"4N RHP", floor_id:"4N", house:"Platinum", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "4SRHP", {code:"4SRHP", code_name:"4S RHP", floor_id:"4S", house:"Platinum", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "5NRHP", {code:"5NRHP", code_name:"5N RHP", floor_id:"5N", house:"Silver", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "5SRHP", {code:"5SRHP", code_name:"5S RHP", floor_id:"5S", house:"Silver", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "6NRHP", {code:"6NRHP", code_name:"6N RHP", floor_id:"6N", house:"Titanium", permission_level:1})
        await FirestoreDataFactory.setHouseCode(db, "6SRHP", {code:"6SRHP", code_name:"6S RHP", floor_id:"6S", house:"Titanium", permission_level:1})

        await FirestoreDataFactory.setHouseCode(db, "PROFST", {code:"PROFSF", code_name: "Professional Staff", permission_level:2})

        await FirestoreDataFactory.setHouseCode(db, "CPFHP1", {code:"CPFHP1", code_name:"Copper FHP", house:"Copper", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "PDFHP1", {code:"PDFHP1", code_name:"Palladium RHP", house:"Palladium", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "PTFHP1", {code:"PTFHP1", code_name:"Platinum RHP", house:"Platinum", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "SIFHP1", {code:"SIFHP1", code_name:"Silver RHP", house:"Silver", permission_level:3})
        await FirestoreDataFactory.setHouseCode(db, "TIFHP1", {code:"TIFHP1", code_name:"Titanium RHP", house:"Titanium", permission_level:3})

        await FirestoreDataFactory.setHouseCode(db, "2NPRIV", {code:"2NPRIV", code_name:"2N PRIV", floor_id:"2N", house:"Copper", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "2SPRIV", {code:"2SPRIV", code_name:"2S PRIV", floor_id:"2S", house:"Copper", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "3NPRIV", {code:"3NPRIV", code_name:"3N PRIV", floor_id:"3N", house:"Palladium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "3SPRIV", {code:"3SPRIV", code_name:"3S PRIV", floor_id:"3S", house:"Palladium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "4NPRIV", {code:"4NPRIV", code_name:"4N PRIV", floor_id:"4N", house:"Platinum", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "4SPRIV", {code:"4SPRIV", code_name:"4S PRIV", floor_id:"4S", house:"Platinum", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "5NPRIV", {code:"5NPRIV", code_name:"5N PRIV", floor_id:"5N", house:"Silver", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "5SPRIV", {code:"5SPRIV", code_name:"5S PRIV", floor_id:"5S", house:"Silver", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "6NPRIV", {code:"6NPRIV", code_name:"6N PRIV", floor_id:"6N", house:"Titanium", permission_level:4})
        await FirestoreDataFactory.setHouseCode(db, "6SPRIV", {code:"6SPRIV", code_name:"6S PRIV", floor_id:"6S", house:"Titanium", permission_level:4})

        await FirestoreDataFactory.setHouseCode(db, "EXTADV", {code:"EXTADV", code_name: "External Advisor", permission_level:5})

    })

    
    it('Test resident results in Invalid Permission Level', async (done) => {
        const res = factory.get(house_codes_func, "/", RESIDENT_ID)
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
        const res = factory.get(house_codes_func, "/", PRIV_RES)
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
        const res = factory.get(house_codes_func, "/", EA_ID)
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

    it('Test Prof staff gets them all', async (done) => {
        const res = factory.get(house_codes_func, "/", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(37)
                done()
            }
        })
    })

    it('Test RHP in Platinum only gets codes from platinum', async (done) => {
        const res = factory.get(house_codes_func, "/", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(3)
                done()
            }
        })
    })

    it('Test Platinum FHP only gets code from Platinum', async (done) => {
        const res = factory.get(house_codes_func, "/", FACULTY)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.house_codes).toHaveLength(2)
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


