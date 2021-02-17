import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/Event.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utilities/APIUtility.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/DateUtil.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';

import 'my_events_event.dart';


class MyEventsRepository {

  final Config config;

  MyEventsRepository(this.config);

  Future deleteEvent(Event event) async {
    await callCloudFunction(config, Method.DELETE, "event/"+event.id);
  }

  Future<List<Event>> getMyEvents() async {
    Map<String,dynamic> eventList = await callCloudFunction(config, Method.GET, "event/");
    Set<Map<String, dynamic>> events = Set.from(eventList["events"]);
    List<Event> evs = new List();
    events.forEach((element) {
      evs.add(Event.fromJson(element));
    });
    return evs;
  }

  Future<Event> createEvent(CreateEvent event) async {
    Map<String, dynamic> body = {"name":event.name, "details":event.details, "startDate":DateUtils.formatISOTime(event.startDate),
      "endDate":DateUtils.formatISOTime(event.endDate), "location":event.location, "floorIds":event.floorIds, "isPublicEvent":event.isPublicEvent,
      "isAllFloors":event.isAllFloors, "host":event.host, "virtualLink":event.virtualLink, "pointTypeId":event.pointTypeId};
    Map<String, dynamic> eventDocument = await callCloudFunction(config, Method.POST, "event/", body: body);
    return Event.fromJson(eventDocument);
  }

  Future<List<PointType>> getPointTypes() async {
    Map<String,dynamic> pointTypeList = await callCloudFunction(config, Method.GET, "point_type/linkable");
    Set<Map<String, dynamic>> pointTypes = Set.from(pointTypeList["point_types"]);
    List<PointType> pts = new List();
    pointTypes.forEach((element) {
      pts.add(PointType.fromJson(element));
    });
    return pts;
  }

  Future updateEvent( UpdateEvent updateEvent) async {
    Map<String, dynamic> body = Map();
    body["id"] = updateEvent.event.id;
    APIUtility.setBodyField(body, Event.NAME, updateEvent.name);
    APIUtility.setBodyField(body, Event.DETAILS, updateEvent.details);
    APIUtility.setBodyField(body, Event.START_DATE, updateEvent.startDate == null ? null: updateEvent.startDate.toIso8601String());
    APIUtility.setBodyField(body, Event.END_DATE, updateEvent.endDate == null ? null: updateEvent.endDate.toIso8601String());
    APIUtility.setBodyField(body, Event.LOCATION, updateEvent.location);
    APIUtility.setBodyField(body, Event.POINT_TYPE_ID, updateEvent.pointTypeId);
    APIUtility.setBodyField(body, Event.FLOOR_IDS, updateEvent.floorIds);
    APIUtility.setBodyField(body, Event.HOST, updateEvent.host);
    APIUtility.setBodyField(body, Event.IS_PUBLIC_EVENT, updateEvent.isPublicEvent);
    APIUtility.setBodyField(body, "isAllFloors", updateEvent.isAllFloors);
    APIUtility.setBodyField(body, Event.VIRTUAL_LINK, updateEvent.virtualLink);
    Map<String,dynamic> element = await callCloudFunction(config, Method.PUT, "event/", body: body);

    return Event.fromJson(element);
  }

}