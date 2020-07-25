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

const ENDPOINT = "/search"

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('GET user/search', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {last:"B"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {last:"LASTEDNAM"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        for(let i = 0; i < 10; i ++){
            await FirestoreDataFactory.setUser(db, "A"+i.toString(), 0, {last: "A"+i.toString()})
            await FirestoreDataFactory.setUser(db, "AB"+i.toString(), 0, {last: "AB"+i.toString()})
            await FirestoreDataFactory.setUser(db, "AC"+i.toString(), 0, {last: "AC"+i.toString()})
        }

    })

    it('No search term results in Missing Required Fields', (done) => {
        const query = {}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
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

    it('Empty search results in Missing Required Fields', (done) => {
        const query = {term: ""}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                done()
            }
        })
    })

    
    it('Test resident results in invalid permission', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
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

    it('Test RHP results in invalid permission', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, RHP_ID, query )
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

    it('Test FHP results in invalid permission', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, FHP_ID, query )
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

    it('Test Priv Res results in invalid permission', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, PRIV_RES, query )
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

    it('Test EA results in invalid permission', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, EA_ID, query )
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

    it('Test term is single letter string returns 25 that start with that letter', (done) => {
        const query = {term: "A"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(25)
                expect(res.body.users[0].lastName).toBe("A0")
                expect(res.body.users[1].lastName).toBe("A1")
                expect(res.body.users[2].lastName).toBe("A2")
                expect(res.body.users[3].lastName).toBe("A3")
                expect(res.body.users[4].lastName).toBe("A4")
                expect(res.body.users[5].lastName).toBe("A5")
                expect(res.body.users[6].lastName).toBe("A6")
                expect(res.body.users[7].lastName).toBe("A7")
                expect(res.body.users[8].lastName).toBe("A8")
                expect(res.body.users[9].lastName).toBe("A9")
                expect(res.body.users[10].lastName).toBe("AB0")
                expect(res.body.users[11].lastName).toBe("AB1")
                expect(res.body.users[12].lastName).toBe("AB2")
                expect(res.body.users[13].lastName).toBe("AB3")
                expect(res.body.users[14].lastName).toBe("AB4")
                expect(res.body.users[15].lastName).toBe("AB5")
                expect(res.body.users[16].lastName).toBe("AB6")
                expect(res.body.users[17].lastName).toBe("AB7")
                expect(res.body.users[18].lastName).toBe("AB8")
                expect(res.body.users[19].lastName).toBe("AB9")
                expect(res.body.users[20].lastName).toBe("AC0")
                expect(res.body.users[21].lastName).toBe("AC1")
                expect(res.body.users[22].lastName).toBe("AC2")
                expect(res.body.users[23].lastName).toBe("AC3")
                expect(res.body.users[24].lastName).toBe("AC4")
                done()
            }
        })
    })

    it('Test term is a single letter and uses pagination', (done) => {
        const query = {term: "A", previousName:"AC4"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(5)
                expect(res.body.users[0].lastName).toBe("AC5")
                expect(res.body.users[4].lastName).toBe("AC9")
                done()
            }
        })
    })

    it('Test term is single letter but doesnt return other letters', (done) => {
        const query = {term:"B"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(1)
                expect(res.body.users[0].lastName).toBe("B")
                done()
            }
        })
    })

    it('Test search for entire name', (done) => {
        const query = {term:"LASTEDNAM"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(1)
                expect(res.body.users[0].lastName).toBe("LASTEDNAM")
                done()
            }
        })
    })

    it('Test search for entire name but no names exist', (done) => {
        const query = {term:"NO EXAMPLE"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(0)
                done()
            }
        })
    })

    it('Test search for entire name with pagination past expected', (done) => {
        const query = {term:"LASTEDNAME", previousName:"LASTEDNAMED"}
        const res = factory.get(user_func, ENDPOINT, PROF_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(0)
                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


