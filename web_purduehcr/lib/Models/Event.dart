import 'dart:core';

import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';

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
  static const String VIRTUAL_LINK = "virtualLink";

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
  String virtualLink;
  Event({@required this.name, @required this.details, @required this.startDate,
    @required this.endDate, @required this.location, @required this.points, @required this.pointTypeId, @required this.pointTypeName,
    @required this.pointTypeDescription, @required this.floorIds, @required this.id,
    @required this.creatorId, @required this.host, @required this.floorColors, @required this.isPublicEvent, @required this.claimedCount, @required this.virtualLink
  });

  factory Event.fromJson(Map<String, dynamic> json){
    print('EVENT: '+json.toString());
    return Event(
        name: json[NAME],
        details: json[DETAILS],
        startDate: DateTime.parse(json[START_DATE]),
        endDate: DateTime.parse(json[END_DATE]),
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
        claimedCount: json[CLAIMED_COUNT],
        virtualLink: json[VIRTUAL_LINK]
    );
  }

  void copyValues(Event event){
    this.name = event.name;
    this.details = event.details;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.location = event.location;
    this.points = event.points;
    this.pointTypeId = event.pointTypeId;
    this.pointTypeName = event.pointTypeName;
    this.pointTypeDescription = event.pointTypeDescription;
    this.points = event.points;
    this.floorIds = event.floorIds;
    this.creatorId = event.creatorId;
    this.host = event.host;
    this.floorColors = event.floorColors;
    this.isPublicEvent = event.isPublicEvent;
    this.claimedCount = event.claimedCount;
    this.virtualLink = event.virtualLink;
  }

  PointType getPointType(){
    return new PointType(int.parse(pointTypeId), pointTypeDescription, true, pointTypeName, PointTypePermissionLevel.ALL, true, points);
  }
}
