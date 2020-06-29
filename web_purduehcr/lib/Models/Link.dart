import 'dart:core';

import 'package:meta/meta.dart';

class Link {

  static const String ARCHIVED = "archived";
  static const String ENABLED = "enabled";
  static const String CREATOR_ID = "creatorId";
  static const String DESCRIPTION = "description";
  static const String POINT_ID = "pointId";
  static const String POINT_TYPE_NAME = "pointTypeName";
  static const String SINGLE_USE = "singleUse";
  static const String ID = "id";

  bool archived;
  bool enabled;
  String creatorId;
  String description;
  int pointTypeId;
  String pointTypeName;
  String id;
  bool singleUse;
  Link({@required this.archived, @required this.enabled, @required this.creatorId,
  @required this.description, @required this.pointTypeId, @required this.id, @required this.singleUse, @required this.pointTypeName
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
      pointTypeName: json[POINT_TYPE_NAME]
    );
  }


}

class LinkToCreate extends Link {
  LinkToCreate(): super(
      archived: false,
      enabled: true,
      creatorId: "",
      description: "",
      pointTypeId: 0,
      id: "",
      singleUse: true,
      pointTypeName: ""
  );

  Map<String, dynamic> getCreationBody(){

  }
}