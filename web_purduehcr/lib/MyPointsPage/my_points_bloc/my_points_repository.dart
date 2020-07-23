import 'dart:async';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';

class MyPointsRepository{
  final Config config;

  MyPointsRepository(this.config);

  Future<List<PointLog>> getMyPoints() async {
    Map<String,dynamic> pointLogList = await callCloudFunction(config, Method.GET, "user/points");
    Set<Map<String, dynamic>> pointLogs = Set.from(pointLogList["points"]);
    List<PointLog> logs = new List();
    pointLogs.forEach((element) {
      logs.add(PointLog.fromJson(element));
    });
    return logs;
  }



}