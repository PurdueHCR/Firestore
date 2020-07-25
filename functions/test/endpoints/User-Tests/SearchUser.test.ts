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
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {last:"LASTEDNAME"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        for(let i = 0; i < 30; i ++){
            await FirestoreDataFactory.setUser(db, "A"+i.toString(), 0, {last: "A"+i.toString()})
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
                expect(res.status).toBe(422)
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
                expect(res.body.users[24].lastName).toBe("A24")
                done()
            }
        })
    })

    it('Test term is a single letter and uses pagination', (done) => {
        const query = {term: "A", previousName:"A24"}
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(5)
                expect(res.body.users[0].lastName).toBe("A25")
                expect(res.body.users[4].lastName).toBe("A29")
                done()
            }
        })
    })

    it('Test term is single letter but doesnt return other letters', (done) => {
        const query = {term:"B"}
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
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
        const query = {term:"LASTEDNAME"}
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.users).toHaveLength(1)
                expect(res.body.users[0].lastName).toBe("LASTEDNAME")
                done()
            }
        })
    })

    it('Test search for entire name but no names exist', (done) => {
        const query = {term:"NO EXAMPLE"}
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
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
        const res = factory.get(user_func, ENDPOINT, RESIDENT_ID, query )
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


