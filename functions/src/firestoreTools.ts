import { APIResponse } from "./models/APIResponse"
import * as admin from 'firebase-admin'

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res , next) => {
	if(req.path === '/getLink'){
		next()
		return
	}

	if(req.path === '/getPointTypes'){
		next()
		return
	}
	
	if(req.path === '/secret-semester-points-set'){
    	next()
  		return
	}

	if(req.path === '/secret-reset-house-competition'){
    	next()
  		return
	}
	  
	if(req.path === '/rank'){
    		next()
  		return
  	}

  	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      	!(req.cookies && req.cookies.__session)) {
    	console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        	'Make sure you authorize your request by providing the following HTTP header:',
        	'Authorization: Bearer <Firebase ID Token>',
			'or by passing a "__session" cookie.')
		const apiError = APIResponse.Unauthorized()
    	res.status(apiError.code).send(apiError.toJson())
    	return
  	}

  	let idToken
  	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		// Read the ID Token from the Authorization header.
    	idToken = req.headers.authorization.split('Bearer ')[1]
  	} else if(req.cookies) {
    	// Read the ID Token from cookie.
    	idToken = req.cookies.__session
  	} else {
		  console.error("Invalid Authorization format and no Cookie")
    	// No cookie
    	const apiError = APIResponse.Unauthorized()
    	res.status(apiError.code).send(apiError.toJson())
    	return
  	}

  	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    	req.user = decodedIdToken
    	next()
    	return
  	} catch (error) {
    	console.error('\u001b[43;1mError while verifying Firebase Token: TOKEN IS INVALID OR HAS EXPIRED. PLEASE GET A NEW TOKEN\u001b[0m')
    	const apiError = APIResponse.Unauthorized()
    	res.status(apiError.code).send(apiError.toJson())
    	return
  	}
}

const flutterReformat = async function(req, res , next){
	if(req.body !== undefined && req.body.data !== undefined 
		&& req.body.data.method !== undefined && req.body.data.payload !== undefined){
		const _temp_send = res.send
		const _temp_status = res.status
		res.send = function (body?: any):any{
			const data = {data:body}
			return _temp_send.apply(res, [JSON.stringify(data)])
		}
		res.status = function (): any {
			return _temp_status.apply(res,[200])
		}

		req.route.path = req.path
		req.method = req.body.data.method
		req.body = req.body.data.payload
	}
	next()
}

module.exports.validateFirebaseIdToken = validateFirebaseIdToken
module.exports.flutterReformat = flutterReformat
