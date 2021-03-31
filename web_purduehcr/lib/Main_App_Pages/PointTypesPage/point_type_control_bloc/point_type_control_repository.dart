import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Main_App_Pages/PointTypesPage/point_type_control_bloc/point_type_control_event.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';
import 'package:purduehcr_web/Utilities/APIUtility.dart';
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

  updatePointType(UpdatePointType event) async{
    Map<String, dynamic> body = Map();
    body["id"] = event.pointType.id;
    APIUtility.setBodyField(body, PointType.DESCRIPTION, event.description);
    APIUtility.setBodyField(body, PointType.ENABLED, event.isEnabled);
    APIUtility.setBodyField(body, PointType.RESIDENTS_CAN_SUBMIT, event.residentsCanSubmit);
    APIUtility.setBodyField(body, PointType.VALUE, event.value);
    APIUtility.setBodyField(body, PointType.PERMISSION_LEVEL, event.permissionLevel != null ? event.permissionLevel.index + 1 : null);
    APIUtility.setBodyField(body, PointType.NAME, event.name);
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