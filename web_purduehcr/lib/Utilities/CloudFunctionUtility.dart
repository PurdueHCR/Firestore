import 'dart:html';

import 'package:cloud_functions/cloud_functions.dart';
import 'package:purduehcr_web/Models/ApiError.dart';

import '../Config.dart';


callCloudFunction(Config config, Method method, String path, {Map<String, dynamic> params, Map<String, dynamic> body}) async {
  window.console.log(config.toString());
  CloudFunctions target = CloudFunctions.instance;
  if(config.env == "DEV"){
    window.console.log("DOING DEV");
    target = target.useFunctionsEmulator(origin: "http://localhost:5001");
  }
  String completePath = path + _serializeParams(params);
  HttpsCallableResult result = await target.getHttpsCallable(functionName: completePath).call({
    "method":method.toString().split('.').last,
    "payload": body
  });
  if(result.data["message"] != null){
    print("GOT API ERROR: "+result.data["message"]);
    String errorString = result.data["message"];
    throw new ApiError(int.parse(errorString.split(": ")[0]), errorString.split(": ")[1]);
  }
  return result.data;
}

String _serializeParams(Map<String, dynamic> params) {
  if (params == null || params.isEmpty) {
    return "";
  }
  else {
    String queryString = "?";
    for (String key in params.keys) {
      queryString += key + "+" + params[key].toString() + "&";
    }
    return queryString.substring(0, queryString.length - 2);
  }
}

enum Method {
  GET,
  POST,
  DELETE
}