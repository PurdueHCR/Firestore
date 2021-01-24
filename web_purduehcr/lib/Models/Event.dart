import 'dart:core';

import 'package:meta/meta.dart';

class Event {

  static const String NAME = "name";
  static const String DETAILS = "details";
  static const String START_DATE = "startDate";
  static const String END_DATE = "endDate";
  static const String LOCATION = "location";
  static const String POINTS = "points";
  static const String POINT_TYPE_ID = "pointTypeId";
  static const String POINT_TYPE_NAME = "pointTypeName";
  static const String POINT_TYPE_DESCRIPTION = "pointTypeDescription";
  static const String FLOOR_IDS = "floorIds";
  static const String ID = "id";
  static const String CREATOR_ID = "creatorId";
  static const String HOST = "host";
  static const String FLOOR_COLORS = "floorColors";
  static const String IS_PUBLIC_EVENT = "isPublicEvent";
  static const String CLAIMED_COUNT = "claimedCount";

  String name;
  String details;
  DateTime startDate;
  DateTime endDate;
  String location;
  int points;
  String pointTypeId;
  String pointTypeName;
  String pointTypeDescription;
  List<String> floorIds;
  String id;
  String creatorId;
  String host;
  List<String> floorColors;
  bool isPublicEvent;
  int claimedCount;
  Event({@required this.name, @required this.details, @required this.startDate,
    @required this.endDate, @required this.location, @required this.points, @required this.pointTypeId, @required this.pointTypeName,
    @required this.pointTypeDescription, @required this.floorIds, @required this.id,
    @required this.creatorId, @required this.host, @required this.floorColors, @required this.isPublicEvent, @required this.claimedCount
  });

  factory Event.fromJson(Map<String, dynamic> json){
    return Event(
        name: json[NAME],
        details: json[DETAILS],
        startDate: json[START_DATE],
        endDate: json[END_DATE],
        location: json[LOCATION],
        points: json[POINTS],
        pointTypeId: json[POINT_TYPE_ID],
        pointTypeName: json[POINT_TYPE_NAME],
        pointTypeDescription: json[POINT_TYPE_DESCRIPTION],
        floorIds: json[FLOOR_IDS],
        id: json[ID],
        creatorId: json[CREATOR_ID],
        host: json[HOST],
        floorColors: json[FLOOR_COLORS],
        isPublicEvent: json[IS_PUBLIC_EVENT],
        claimedCount: json[CLAIMED_COUNT]
    );
  }

}
