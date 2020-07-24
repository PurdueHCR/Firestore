import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

class HouseCode {
  static const String ID = "id";
  static const String CODE = "code";
  static const String CODE_NAME = "codeName";
  static const String HOUSE = "house";
  static const String PERMISSION_LEVEL = "permissionLevel";
  static const String DYNAMIC_LINK = "dynamicLink";

  String id;
  String code;
  String codeName;
  String house;
  UserPermissionLevel permissionLevel;
  String dynamicLink;

  HouseCode({this.id, this.code, this.codeName, this.house, this.permissionLevel, this.dynamicLink});

  factory HouseCode.fromJson(Map<String, dynamic> json){
    return HouseCode(
      id: json[ID],
      code: json[CODE],
      codeName: json[CODE_NAME],
      house: json[HOUSE],
      permissionLevel: UserPermissionLevelConverter.fromNum(json[PERMISSION_LEVEL]),
      dynamicLink: json[DYNAMIC_LINK]
    );
  }
}