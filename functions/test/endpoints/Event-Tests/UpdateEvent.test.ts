import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let event_function
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const EA_ID = "PROFFESSIONAL_STAFF"

const ENDPOINT = '/'
const NOT_OWNED_BY_EA_EVENT_ID = 'NOT_OWNED_BY_EA_EVENT_ID'
const EVENT_TO_UPDATE_ALL_FIELDS = 'EVENT_TO_UPDATE_ALL_FIELDS'


let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('Update Event/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        event_function = require('../../../src/endpoint_paths/index.ts').event

        await FirestoreDataFactory.setAllHouses(db)
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setPointType(db, 2, {description:'point type description', value: 22,name:'pt name'})


        await FirestoreDataFactory.setEvent(db, NOT_OWNED_BY_EA_EVENT_ID, RHP_ID)
        await FirestoreDataFactory.setEvent(db, EVENT_TO_UPDATE_ALL_FIELDS, RHP_ID)
        await FirestoreDataFactory.setEvent(db, 'EVENT 3', RHP_ID)

    })

    it('Missing Event Id in body', async (done) => {
        const res = factory.put(event_function, ENDPOINT, {}, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                done()
            } 
        })
    })

    it('Event Id doesn\'t exist ', async (done) => {
        const res = 2
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(450)
                done()
            } 
        })
    })

    it('Try to update event the user doesn\'t own', async (done) => {
        const res = factory.put(event_function, ENDPOINT,{id:NOT_OWNED_BY_EA_EVENT_ID, host:'SUPER COOL EA HOST'}, EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(432)
                done()
            } 
        })
    })

    it('Update all fields', async (done) => {
        const startDate = new Date()
        startDate.setFullYear(startDate.getFullYear()+1)
        const endDate = new Date()
        endDate.setFullYear(endDate.getFullYear()+2)
        const body = {
            id:EVENT_TO_UPDATE_ALL_FIELDS, 
            name:'Update_all_fields_name', 
            details:'update_all_fields_details', 
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            location: 'update_all_fields_location',
            pointTypeId: '2',
            floorIds: ['6N','6S'],
            host:'update_all_fields_host',
            isAllFloors:false,
            isPublicEvent:false
        }
        const res = factory.put(event_function, ENDPOINT,body , RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.name).toBe('Update_all_fields_name')
                expect(res.body.details).toBe('update_all_fields_details')
                expect(res.body.startDate).toBe(startDate.toISOString())
                expect(res.body.endDate).toBe(endDate.toISOString())
                expect(res.body.location).toBe('update_all_fields_location')
                expect(res.body.pointTypeId).toBe('2')
                expect(res.body.points).toBe(22)
                expect(res.body.pointTypName).toBe('pt name')
                expect(res.body.pointTypeDescription).toBe('point type description')
                expect(res.body.floorIds).toBe(['6N','6s'])
                expect(res.body)

                done()
            } 
        })
    })

    it('Update publicEvent overrides all floors', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })

    it('Update is all floors sets all floors and colors', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })

    it('Set is all floors to false with floor ids', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })

    it('Set is allFloors event to false without floor ids', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })

    it('Set is public event to true with floor ids', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })

    it('Set is public event to false', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
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
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


