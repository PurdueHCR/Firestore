import *  as request from 'supertest'
import * as functions from 'firebase-functions'

/**
 * Helper function for a post HTTPRequest
 * @param func The HttpsFunction you are trying to test. This should be a function that you get from the main index.ts
 * @param path The path after the function. For example if you try to call "/user/submitPoint" the path should be "/submitPoint"
 * @param body Json object to be used as the body
 * @param token The token for the user. If you use the IntegrationMockFactory to mock firebase-admin, then the token should be the id of the user 
 */
export function post(func: functions.HttpsFunction, path: string, body:any, token: string): request.Test{
  const httpRequest = request(func).post(path).send(body).type('form')
  httpRequest.set("Authorization", "Bearer "+token)
  httpRequest.set('Content-Type', 'application/x-www-form-urlencoded')
  return httpRequest;
}

/**
 * Helper function for a put HTTPRequest
 * @param func The HttpsFunction you are trying to test. This should be a function that you get from the main index.ts
 * @param path The path after the function. For example if you try to call "/user/submitPoint" the path should be "/submitPoint"
 * @param body Json object to be used as the body
 * @param token The token for the user. If you use the IntegrationMockFactory to mock firebase-admin, then the token should be the id of the user 
 */
export function put(func: functions.HttpsFunction, path: string, body:any, token: string): request.Test{
  const httpRequest = request(func).put(path).send(body).type('form')
  httpRequest.set("Authorization", "Bearer "+token)
  httpRequest.set('Content-Type', 'application/x-www-form-urlencoded')
  return httpRequest;
}

/**
 * Helper function for a get HTTPRequest
 * @param func The HttpsFunction you are trying to test. This should be a function that you get from the main index.ts
 * @param path path after the function. For example if you try to call "/user/get" the path should be "/get"
 * @param token The token for the user. If you use the IntegrationMockFactory to mock firebase-admin, then the token should be the id of the user
 */
export function get(func: functions.HttpsFunction, path: string, token: string, params: any = {}): request.Test{
  console.log("Checking "+path+convertQueryParams(params))
  const httpRequest = request(func).get(path+convertQueryParams(params));
  httpRequest.set("Authorization", "Bearer "+token)
  httpRequest.set('Content-Type', 'application/x-www-form-urlencoded')
  return httpRequest;
}

/**
 * Helper function for a delete HTTPRequest
 * @param func The HttpsFunction you are trying to test. This should be a function that you get from the main index.ts
 * @param path path after the function. For example if you try to call "/user/get" the path should be "/get"
 * @param token The token for the user. If you use the IntegrationMockFactory to mock firebase-admin, then the token should be the id of the user
 */
export function deleteCommand(func: functions.HttpsFunction, path: string, token: string, body: any = {}): request.Test{
  const httpRequest = request(func).delete(path).send(body).type('form')
  httpRequest.set("Authorization", "Bearer "+token)
  httpRequest.set('Content-Type', 'application/x-www-form-urlencoded')
  return httpRequest;
}

function convertQueryParams(params: any): string{
  let queryParams  = "?"
  for(let key in params){
    queryParams += key+"="+params[key]+"&"
  }

  return queryParams.slice(0,-1)
}