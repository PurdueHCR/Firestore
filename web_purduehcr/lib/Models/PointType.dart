import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';

class PointType{

  static const String ID = "id";
  static const String DESCRIPTION = "description";
  static const String ENABLED = "enabled";
  static const String NAME = "name";
  static const String PERMISSION_LEVEL = "permissionLevel";
  static const String RESIDENTS_CAN_SUBMIT = "residentsCanSubmit";
  static const String VALUE = "value";
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
    num id = int.parse(data[ID]);
    String description = data[DESCRIPTION];
    bool enabled = data[ENABLED];
    String name = data[NAME];
    PointTypePermissionLevel permissionLevel = PointTypePermissionLevelConverter.fromNum(data[PERMISSION_LEVEL]);
    bool canResidentsSubmit = data[RESIDENTS_CAN_SUBMIT];
    num value = data[VALUE];
    return PointType(id, description, enabled, name, permissionLevel, canResidentsSubmit, value);
  }

  Map<String, dynamic> toJson(){
    Map<String,  dynamic> map = new Map();
    map[ID] = id;
    map[DESCRIPTION] = description;
    map[ENABLED] = enabled;
    map[NAME] = name;
    map[PERMISSION_LEVEL] = permissionLevel.index;
    map[RESIDENTS_CAN_SUBMIT] = canResidentsSubmit;
    map[VALUE] = value;
    return map;
  }

  String toString(){
    return toJson().toString();
  }

}