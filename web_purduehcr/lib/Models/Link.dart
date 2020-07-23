import 'dart:core';

import 'package:meta/meta.dart';

class Link {

  static const String ARCHIVED = "archived";
  static const String ENABLED = "enabled";
  static const String CREATOR_ID = "creatorId";
  static const String DESCRIPTION = "description";
  static const String POINT_ID = "pointId";
  static const String POINT_TYPE_NAME = "pointTypeName";
  static const String POINT_TYPE_DESCRIPTION = "pointTypeDescription";
  static const String POINT_TYPE_VALUE = "pointTypeValue";
  static const String SINGLE_USE = "singleUse";
  static const String ID = "id";
  static const String DYNAMIC_LINK = "dynamicLink";

  bool archived;
  bool enabled;
  String creatorId;
  String description;
  int pointTypeId;
  String pointTypeName;
  String pointTypeDescription;
  int pointTypeValue;
  String id;
  bool singleUse;
  String dynamicLink;
  Link({@required this.archived, @required this.enabled, @required this.creatorId,
  @required this.description, @required this.pointTypeId, @required this.id,
  @required this.singleUse, @required this.pointTypeName, @required this.pointTypeDescription,
    @required this.pointTypeValue, @required this.dynamicLink
  });

  factory Link.fromJson(Map<String, dynamic> json){
    return Link(
      archived: json[ARCHIVED],
      enabled: json[ENABLED],
      creatorId: json[CREATOR_ID],
      description: json[DESCRIPTION],
      pointTypeId: json[POINT_ID],
      id: json[ID],
      singleUse: json[SINGLE_USE],
      pointTypeName: json[POINT_TYPE_NAME],
      pointTypeDescription: json[POINT_TYPE_DESCRIPTION],
      pointTypeValue: json[POINT_TYPE_VALUE],
      dynamicLink: json[DYNAMIC_LINK]
    );
  }

}
