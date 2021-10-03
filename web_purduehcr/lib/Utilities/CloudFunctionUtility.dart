import 'dart:convert';

import 'package:cloud_functions/cloud_functions.dart';
import 'package:purduehcr_web/Models/ApiError.dart';

import '../Configuration/Config.dart';


callCloudFunction(Config config, Method method, String path, {Map<String, dynamic> params, Map<String, dynamic> body}) async {
  FirebaseFunctions target = FirebaseFunctions.instanceFor(region: 'us-central1');
  if(config.env == "DEV"){
    target.useFunctionsEmulator("localhost", 5001);
  }
  String completePath = path + _serializeParams(params);
  HttpsCallableResult result = await target.httpsCallable(completePath).call({
    "method":method.toString().split('.').last,
    "payload": body
  });
  Map<String, dynamic> responseMap;
  if(result.data is String){
    responseMap = jsonDecode(result.data);
  }
  else{
    responseMap = result.data;
  }
  if(responseMap["message"] != null){
    String errorString = responseMap["message"];
    int errorCode = int.parse(errorString.split(": ")[0]);
    String errorMessage = errorString.substring(errorString.indexOf(':') +1);
    print('ERROR: '+errorCode.toString());
    throw ApiError(errorCode, errorMessage);
  }
  return responseMap;
}

String _serializeParams(Map<String, dynamic> params) {
  if (params == null || params.isEmpty) {
    return "";
  }
  else {
    String queryString = "?";
    for (String key in params.keys) {
      queryString += key + "=" + params[key].toString() + "&";
    }
    return queryString.substring(0, queryString.length - 1);
  }
}

enum Method {
  GET,
  POST,
  DELETE,
  PUT
}