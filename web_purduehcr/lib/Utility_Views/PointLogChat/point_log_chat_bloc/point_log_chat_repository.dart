import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class PointLogChatRepository {

  final Config config;

  PointLogChatRepository(this.config);

  Future<List<PointLogMessage>> getMessages(PointLog log, {String house}) async{
    Map<String,dynamic> params = {"log_id":log.id};
    if(house != null){
      params["house"] = house;
    }
    Map<String,dynamic> pointLogMessageList = await callCloudFunction(config, Method.GET, "point_log/messages", params: params);

    Set<Map<String, dynamic>> pointLogMessage = Set.from(pointLogMessageList["messages"]);
    List<PointLogMessage> messages = new List();
    pointLogMessage.forEach((element) {
      messages.add(PointLogMessage.fromJson(element));
    });
    return messages;
  }

  Future postMessage(PointLog log, String message, {String house}) async {
    Map<String,dynamic> body = {"log_id": log.id, "message": message};
    if(house != null){
      body["house"] = house;
    }
    await callCloudFunction(config, Method.POST, "point_log/messages",
        body: body);
  }

  Future handlePointLog(PointLog log, bool approved, {String message = ""}) async {
    try {
      await callCloudFunction(config, Method.POST, "point_log/handle",
      body: {"point_log_id": log.id, "message": message, "approve":approved.toString()});
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