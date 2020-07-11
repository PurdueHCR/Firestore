import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
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


}