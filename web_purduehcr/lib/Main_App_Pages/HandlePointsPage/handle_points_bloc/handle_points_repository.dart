import 'dart:async';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';

class HandlePointRepository{
  final Config config;

  HandlePointRepository(this.config);

  Future<List<PointLog>> getUnhandledPoints() async {
    Map<String,dynamic> pointLogList = await callCloudFunction(config, Method.GET, "competition/getUnhandledPoints");
    Set<Map<String, dynamic>> pointLogs = Set.from(pointLogList["point_logs"]);
    List<PointLog> logs = new List();
    pointLogs.forEach((element) {
      logs.add(PointLog.fromJson(element));
    });
    return logs;
  }

//  Future<List<PointLogMessage>> getMessages(PointLog log) async{
//    Map<String,dynamic> pointLogMessageList = await callCloudFunction(config, Method.GET, "point_log/messages", params: {"log_id":log.id});
//    Set<Map<String, dynamic>> pointLogMessage = Set.from(pointLogMessageList["messages"]);
//    List<PointLogMessage> messages = new List();
//    pointLogMessage.forEach((element) {
//      messages.add(PointLogMessage.fromJson(element));
//    });
//    return messages;
//  }
//
//  void postMessage(PointLog log, String message) async {
//    await callCloudFunction(config, Method.POST, "point_log/messages", params: {"log_id":log.id, "message":message});
//  }

}