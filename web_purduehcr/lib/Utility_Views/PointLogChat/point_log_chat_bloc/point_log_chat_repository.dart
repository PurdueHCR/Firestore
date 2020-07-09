import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class PointLogChatRepository {

  final Config config;

  PointLogChatRepository(this.config);

  Future<List<PointLogMessage>> getMessages(PointLog log) async{
    Map<String,dynamic> pointLogMessageList = await callCloudFunction(config, Method.GET, "point_log/messages", params: {"log_id":log.id});
    Set<Map<String, dynamic>> pointLogMessage = Set.from(pointLogMessageList["messages"]);
    List<PointLogMessage> messages = new List();
    pointLogMessage.forEach((element) {
      messages.add(PointLogMessage.fromJson(element));
    });
    return messages;
  }

  Future postMessage(PointLog log, String message) async {
    try {
      await callCloudFunction(config, Method.POST, "point_log/messages",
          body: {"log_id": log.id, "message": message});
    }
    catch(error){
      if(error is ApiError){
        if(error.errorCode == 200){
          return Future.value();
        }
        else{
          Future.error(error.message);
        }
      }
      else{
        Future.error("Unknown Server error");
      }
    }
  }

  Future handlePointLog(PointLog log, bool approved, {String message = ""}) async {
    try {
      await callCloudFunction(config, Method.POST, "point_log/handle",
      body: {"point_log_id": log.id, "message": message, "approve":approved});
    }
    catch(error){
      if(error is ApiError){
        if(error.errorCode == 200){
          return Future.value();
        }
        else{
          return Future.error(error.message);
        }
      }
      else{
        return Future.error("Unknown Server error");
      }
    }
  }
}