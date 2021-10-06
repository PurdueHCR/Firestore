import 'dart:convert';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:purduehcr_web/Models/ApiError.dart';

import '../Configuration/Config.dart';


callCloudFunction(Config config, Method method, String path, {Map<String, dynamic> params, Map<String, dynamic> body}) async {
  FirebaseFunctions target = FirebaseFunctions.instanceFor(region: "us-central1");
  if(config.env == "DEV"){
    target.useFunctionsEmulator("localhost", 5001);
  }
  String completePath = path + _serializeParams(params);
  HttpsCallableResult result = await target.httpsCallable(completePath).call({
    "method":method.toString().split('.').last,
    "payload": body
  });

  // TODO: Better status determination
  if(result.data.length == 1){
    String errorString = result.data["message"];
    throw new ApiError(int.parse(errorString.split(": ")[0]), errorString.split(": ")[1]);
  }
  return jsonDecode(result.data);
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