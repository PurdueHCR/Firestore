
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:purduehcr_web/Models/HTTPError.dart';

import '../Models/User.dart';

class Network {

  //static String domain = "https://us-central1-purdue-hcr-test.cloudfunctions.net/";
  static String domain = "http://localhost:5001/purdue-hcr-test/us-central1/";

  static Future<dynamic> get(String path, String token, {Map<String, dynamic> params}) async {
    path = path + _serializeParams(params);
    Map<String,String> headers = {"Authorization": "Bearer "+token};
    final response = await http.get(domain + path,headers: headers);
    if(response.statusCode == 200 ){
      return Future.value(json.decode(response.body));
    }else{
      return Future.error( HttpError(response.statusCode, response.body) );
    }
  }

  static Future<Map<String,dynamic>> post(String path, String token, {Map<String,dynamic> body, Map<String, dynamic> params}) async {
    path = path + _serializeParams(params);
    Map<String,String> headers = {"Authorization": "Bearer "+token};
    final response = await http.post(domain + path,headers: headers, body: body);
    if(isSuccessCode(response.statusCode)){
      print("GOT JSON: "+response.body.toString() );
      return Future.value(json.decode(response.body));
    }else{
      print("GOT ERROR: "+response.statusCode.toString() +": "+response.body.toString());
      return Future.error( HttpError(response.statusCode, json.decode(response.body)) );
    }
  }

  static Future<Map<String,dynamic>> delete(String path, String token) async {
    Map<String,String> headers = {"Authorization": "Bearer "+token};
    final response = await http.delete(domain + path,headers: headers);
    if(isSuccessCode(response.statusCode)){
      return Future.value( json.decode(response.body) );
    }else{
      return Future.error( HttpError(response.statusCode, response.body) );
    }
  }

  static Future<Map<String,dynamic>> put(String path, String token, Map<String,String> headers) async {
    Map<String,String> headers = {"Authorization": "Bearer "+token};
    final response = await http.put(domain + path,headers: headers);
    if(isSuccessCode(response.statusCode)){
      return Future.value(json.decode(response.body));
    }else{
      return Future.error( HttpError(response.statusCode, response.body) );
    }
  }

  static String _serializeParams(Map<String, dynamic> params) {
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

  static bool isSuccessCode(num code){
    return code == 200 || code == 201 || code == 202;
  }
}