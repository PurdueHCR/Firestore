import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class PointTypeControlRepository {

  final Config config;

  PointTypeControlRepository(this.config);

  Future<List<PointType>> getPointTypes() async {
    Map<String,dynamic> pointTypeList = await callCloudFunction(config, Method.GET, "point_type/");
    Set<Map<String, dynamic>> pointTypes = Set.from(pointTypeList["point_types"]);
    List<PointType> pts = new List();
    pointTypes.forEach((element) {
      pts.add(PointType.fromJson(element));
    });
    return pts;
  }

  updatePointType(PointType pointType, {bool isEnabled, bool residentsCanSubmit, int value, PointTypePermissionLevel permissionLevel, String description, String name}) async{
    Map<String, dynamic> body = Map();
    body["id"] = pointType.id;
    if(description != null)
      body[PointType.DESCRIPTION] = description;
    if((isEnabled != null))
      body[PointType.ENABLED] = isEnabled;
    if(residentsCanSubmit != null)
      body[PointType.RESIDENTS_CAN_SUBMIT] = residentsCanSubmit;
    if(value != null)
      body[PointType.VALUE] = value;
    if(permissionLevel != null)
      body[PointType.PERMISSION_LEVEL] = permissionLevel.index + 1;
    if(name != null)
      body[PointType.NAME] = name;
    await callCloudFunction(config, Method.PUT, "point_type/", body: body);
  }

  createPointType(bool isEnabled, bool residentsCanSubmit, int value, PointTypePermissionLevel permissionLevel, String description, String name) async{
    Map<String, dynamic> body = Map();
    body[PointType.DESCRIPTION] = description;
    body[PointType.ENABLED] = isEnabled;
    body[PointType.RESIDENTS_CAN_SUBMIT] = residentsCanSubmit;
    body[PointType.VALUE] = value;
    body[PointType.PERMISSION_LEVEL] = permissionLevel.index + 1;
    body[PointType.NAME] = name;
    Map<String,dynamic> pointType = await callCloudFunction(config, Method.POST, "point_type/", body: body);
    return PointType.fromJson(pointType["point_type"]);
  }

}