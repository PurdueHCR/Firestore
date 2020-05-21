import 'dart:convert';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:purduehcr_web/Models/ApiError.dart';


callCloudFunction(Method method, String path, {Map<String, dynamic> params, Map<String, dynamic> body}) async {
  HttpsCallableResult result = await CloudFunctions.instance
      .useFunctionsEmulator(origin: "http://localhost:5001")
      .getHttpsCallable(functionName: path+_serializeParams(params))
      .call({
    "method":method.toString().split('.').last,
    "payload": body
  });
  print(result.data);
  if(result.data["message"] != null){
    print("GOT API ERROR");
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