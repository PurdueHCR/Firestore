import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class HistoryRepository {

  final Config config;

  HistoryRepository(this.config);

  Future<List<PointType>> getPointTypes() async {
    Map<String,dynamic> pointTypeList = await callCloudFunction(config, Method.GET, "point_type/linkable");
    Set<Map<String, dynamic>> pointTypes = Set.from(pointTypeList["point_types"]);
    List<PointType> pts = new List();
    pointTypes.forEach((element) {
      pts.add(PointType.fromJson(element));
    });
    return pts;
  }

  Future<List<PointLog>> getRecentHistory({DateTime date, DateTime startAt, String house}) async {
    Map<String, dynamic> params = {"type":"recent"};
    if(date != null){
      params["date"] = date;
    }
    if(startAt != null){
      params["startAt"] = startAt;
    }
    if(house != null){
      params["house"] = house;
    }
    Map<String,dynamic> pointLogList = await callCloudFunction(config, Method.GET, "competition/history", params: params);
    Set<Map<String, dynamic>> pointLogs = Set.from(pointLogList["point_logs"]);
    List<PointLog> logs = new List();
    pointLogs.forEach((element) {
      logs.add(PointLog.fromJson(element));
    });
    return logs;
  }

  Future<List<PointLog>> getUserHistory(String userLastName, {DateTime startAt, String house}) async {
    Map<String, dynamic> params = {"type":"user", "last_name":userLastName};
    if(startAt != null){
      params["startAt"] = startAt;
    }
    if(house != null){
      params["house"] = house;
    }
    Map<String,dynamic> pointLogList = await callCloudFunction(config, Method.GET, "competition/history", params: params);
    Set<Map<String, dynamic>> pointLogs = Set.from(pointLogList["point_logs"]);
    List<PointLog> logs = new List();
    pointLogs.forEach((element) {
      logs.add(PointLog.fromJson(element));
    });
    return logs;
  }

  Future<List<PointLog>> getPointTypeHistory(PointType pointType, {DateTime startAt, String house}) async {
    Map<String, dynamic> params = {"type":"point_type", "point_type_id":pointType.id};
    if(startAt != null){
      params["startAt"] = startAt;
    }
    if(house != null){
      params["house"] = house;
    }
    Map<String,dynamic> pointLogList = await callCloudFunction(config, Method.GET, "competition/history", params: params);
    Set<Map<String, dynamic>> pointLogs = Set.from(pointLogList["point_logs"]);
    List<PointLog> logs = new List();
    pointLogs.forEach((element) {
      logs.add(PointLog.fromJson(element));
    });
    return logs;
  }
}