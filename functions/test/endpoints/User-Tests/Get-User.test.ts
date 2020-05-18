import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
const RESIDENT_ID = "RESIDENT"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('user/get', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
    })

    //Test Unknown User
    it('Unknown User', (done) => {
        const res = factory.get(user_func, "/get", "BADID")
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(400)
                done()
            }
        })
    })

    //Test Unknown User
    it('Bad Token', (done) => {
        const res = factory.get(user_func, "/get", "INVALIDID")
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(401)
                done()
            }
        })
    })

    //Test that it successfully gets a user
    it('Success Get User', (done) =>{
        const res = factory.get(user_func, "/get", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)

                //TODO add expect statements to verify that the user is returned in full
                done()
            }
        })
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


