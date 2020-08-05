import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
const RESIDENT_A = "RESIDENT_A"
const RESIDENT_B = "RESIDENT_B"
const RESIDENT_C = "RESIDENT_C"
const RESIDENT_D = "RESIDENT_D"
const RESIDENT_E = "RESIDENT_E"
const RESIDENT_F = "RESIDENT_F"
const RESIDENT_G = "RESIDENT_G"

const RHP_ID = "RHP_ID"
const PROF_ID = "Proffesional_id"
const FHP_ID = "FHP_ID"
const PRIV_RES = "Priv_res_id"
const EA_ID = "EA_ID"

const ENDPOINT = "/auth-rank"

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('GET user/auth-rank', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user


        await FirestoreDataFactory.setAllHouses(db)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name:"Platinum"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)


        await FirestoreDataFactory.setUser(db, RESIDENT_A, 0, {house_name:"Silver", total_points:100, semester_points:0})
        await FirestoreDataFactory.setUser(db, RESIDENT_B, 0, {house_name:"Silver", total_points:80, semester_points:9})
        await FirestoreDataFactory.setUser(db, RESIDENT_C, 0, {house_name:"Silver", total_points:80, semester_points:6})
        await FirestoreDataFactory.setUser(db, RESIDENT_D, 0, {house_name:"Silver", total_points:60, semester_points:6})
        await FirestoreDataFactory.setUser(db, RESIDENT_E, 0, {house_name:"Silver", total_points:10, semester_points:10})
        await FirestoreDataFactory.setUser(db, RESIDENT_F, 0, {house_name:"Platinum", total_points:8, semester_points:8})
        await FirestoreDataFactory.setUser(db, RESIDENT_G, 0, {house_name:"Titanium", total_points:0, semester_points:0})

        await FirestoreDataFactory.setUserHouseRank(db, "Silver", RESIDENT_A, "RES","A",100,0)
        await FirestoreDataFactory.setUserHouseRank(db, "Silver", RESIDENT_B, "RES","B",80,9)
        await FirestoreDataFactory.setUserHouseRank(db, "Silver", RESIDENT_C, "RES","C",80,6)
        await FirestoreDataFactory.setUserHouseRank(db, "Silver", RESIDENT_D, "RES","D",60,6)
        await FirestoreDataFactory.setUserHouseRank(db, "Silver", RESIDENT_E, "RES","E",10,10)
        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", RESIDENT_F, "RES","F",8,8)
        await FirestoreDataFactory.setUserHouseRank(db, "Titanium", RESIDENT_G, "RES", "G", 0, 0)
        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", RHP_ID, "RHP","Name",0,0)
        await FirestoreDataFactory.setUserHouseRank(db, "Platinum", PRIV_RES, "PRIV","Res",0,0)



    })

    it('Professional Staff cant access auth-rank', (done) => {
        const res = factory.get(user_func, ENDPOINT, PROF_ID )
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

    it('FHP cant access auth-rank', (done) => {
        const res = factory.get(user_func, ENDPOINT, FHP_ID )
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

    it('EA cant access auth-rank', (done) => {
        const res = factory.get(user_func, ENDPOINT, EA_ID )
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

    it('Only resident in house', (done) => {
        const res = factory.get(user_func, ENDPOINT, RESIDENT_G )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(1)
                expect(res.body.semesterRank).toBe(1)
                done()
            }
        })
    })

    it('Only resident in hosue with points', (done) => {
        const res = factory.get(user_func, ENDPOINT, RESIDENT_F )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(1)
                expect(res.body.semesterRank).toBe(1)
                done()
            }
        })
    })

    it('Last Place in year, first in semester', (done) => {
        const res = factory.get(user_func, ENDPOINT, RESIDENT_E )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(5)
                expect(res.body.semesterRank).toBe(1)
                done()
            }
        })
    })

    it('First Place in house, last place in semester', (done) => {
        const res = factory.get(user_func, ENDPOINT, RESIDENT_A )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(1)
                expect(res.body.semesterRank).toBe(5)
                done()
            }
        })
    })

    it('Residents are tied', (done) => {
        const res = factory.get(user_func, ENDPOINT, RESIDENT_C )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(2)
                expect(res.body.semesterRank).toBe(3)
                done()
            }
        })
    })

    it('RHP tied last', (done) => {
        const res = factory.get(user_func, ENDPOINT, RHP_ID )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(2)
                expect(res.body.semesterRank).toBe(2)
                done()
            }
        })
    })

    it('Priv Res tied last', (done) => {
        const res = factory.get(user_func, ENDPOINT, PRIV_RES )
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.houseRank).toBe(2)
                expect(res.body.semesterRank).toBe(2)
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


