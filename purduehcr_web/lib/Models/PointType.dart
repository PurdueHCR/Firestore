import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';

class PointType{
  num id;
  String description;
  bool enabled;
  String name;
  PointTypePermissionLevel permissionLevel;
  bool canResidentsSubmit;
  num value;

  PointType(this.id, this.description, this.enabled, this.name,
      this.permissionLevel, this.canResidentsSubmit, this.value);

  static PointType fromJson(Map<String, dynamic> data){
    num id = int.parse(data["id"]);
    String description = data["description"];
    bool enabled = data["enabled"];
    String name = data["name"];
    PointTypePermissionLevel permissionLevel = PointTypePermissionLevelConverter.fromNum(data["permissionLevel"]);
    bool canResidentsSubmit = data["residentCanSubmit"];
    num value = data["value"];
    return PointType(id, description, enabled, name, permissionLevel, canResidentsSubmit, value);
  }

  Map<String, dynamic> toJson(){
    Map<String,  dynamic> map = new Map();
    map["id"] = id;
    map["description"] = description;
    map["enabled"] = enabled;
    map["name"] = name;
    map["permissionLevel"] = permissionLevel.index;
    map["residentCanSubmit"] = canResidentsSubmit;
    map["value"] = value;
    return map;
  }

  String toString(){
    return toJson().toString();
  }

}