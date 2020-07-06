import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let link_function
const RHP_ID = "RHP_link_create"
const PROF_ID = "Proffesional Staff_link_create"

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('link/create', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        link_function = require('../../../src/endpoint_paths/index.ts').link

        await FirestoreDataFactory.setUser(db, RHP_ID, 1)

        //Disabled Point Type
        await FirestoreDataFactory.setPointType(db, 0, {residents_can_submit: true, is_enabled: false, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 1, {residents_can_submit: true, is_enabled: true, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: true, is_enabled: true, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 3, {residents_can_submit: true, is_enabled: true, permission_level: 3})

        await FirestoreDataFactory.setLink(db, "Link 1", PROF_ID, 1)
        await FirestoreDataFactory.setLink(db, "Link 2", RHP_ID, 2, {description: "LINK 2", enabled: false, single_use: true, archived: false})


        await FirestoreDataFactory.setSystemPreference(db)
    })


    test('Link doesnt exist -> error', async (done) => {
        const res = factory.put(link_function, "/update", {link_id: "Unknown Link", singleUse: false}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(408)
                done()
            }
        })
    })


    test('Link doesnt belong to user -> error', async (done) => {
        const res = factory.put(link_function, "/update", {link_id: "Link 1", singleUse: false}, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(407)
                done()
            }
        })
    })

    test('Request doesnt include link id -> error', async (done) => {
        const res = factory.put(link_function, "/update", { singleUse: false}, RHP_ID)
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

    test('Request doesnt include any fields to update', async (done) => {
        const res = factory.put(link_function, "/update", { link_id: "Link 2"}, RHP_ID)
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

    test('Link Update Success', async (done) => {
        const res = factory.put(link_function, "/update", { link_id: "Link 2", archived:true, enabled: true, singleUse: false, description: "Brand new description"}, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const link =  await db.collection("Links").doc("Link 2").get()
                expect(link.exists).toBeTruthy()
                expect(link.data()!["Description"]).toBe("Brand new description")
                expect(link.data()!["SingleUse"]).toBe("false")
                expect(link.data()!["Archived"]).toBe("true")
                expect(link.data()!["Enabled"]).toBe("true")
                done()
            }
        })
    })

    afterEach(async ()=> {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true, is_competition_visible: true})
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


