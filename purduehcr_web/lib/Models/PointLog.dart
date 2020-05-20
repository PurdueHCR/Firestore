import 'package:meta/meta.dart';

class PointLog{

  static const String APPROVED_BY = "approvedBy";
  static const String APPROVED_ON = "approvedOn";
  static const String DATE_OCCURRED = "dateOccurred";
  static const String DATE_SUBMITTED = "dateSubmitted";
  static const String DESCRIPTION = "description";
  static const String FLOOR_ID = "floorID";
  static const String POINT_TYPE_ID = "pointTypeID";
  static const String RHP_NOTIFICATION = "rhpNotification";
  static const String RESIDENT_FIRST_NAME = "residentFirstName";
  static const String RESIDENT_ID = "residentId";
  static const String RESIDENT_LAST_NAME = "residentLastName";
  static const String RESIDENT_NOTIFICATIONS = "residentNotifications";
  static const String ID_KEY = "id";

  DateTime approvedOn;
  String approvedBy;
  DateTime dateOccurred;
  DateTime dateSubmitted;
  String description;
  String floorId;
  int pointTypeId;
  int rhpNotifications;
  String residentFirstName;
  String residentId;
  String residentLastName;
  int residentNotifications;
  String id;

  PointLog({
      @required this.dateOccurred,
      @required this.dateSubmitted,
      @required this.description,
      @required this.floorId,
      @required this.pointTypeId,
      @required this.rhpNotifications,
      @required this.residentFirstName,
      @required this.residentId,
      @required this.residentLastName,
      @required this.residentNotifications,
      @required this.id,
      this.approvedBy,
      this.approvedOn
});

  factory PointLog.fromJson(Map<String, dynamic> json){
    return PointLog(
      dateOccurred: DateTime.fromMicrosecondsSinceEpoch((json[DATE_OCCURRED]["_seconds"] as int) * 1000),
      dateSubmitted: DateTime.fromMicrosecondsSinceEpoch((json[DATE_SUBMITTED]["_seconds"] as int) * 1000),
      description: json[DESCRIPTION],
      floorId: json[FLOOR_ID],
      pointTypeId: json[POINT_TYPE_ID],
      rhpNotifications: json[RHP_NOTIFICATION],
      residentFirstName: json[RESIDENT_FIRST_NAME],
      residentId: json[RESIDENT_ID],
      residentLastName: json[RESIDENT_LAST_NAME],
      residentNotifications: json[RESIDENT_NOTIFICATIONS],
      id: json[ID_KEY],
      approvedBy: json[APPROVED_BY],
      approvedOn: (json[APPROVED_ON] != null)?DateTime.fromMicrosecondsSinceEpoch((json[APPROVED_ON]["_seconds"] as int) * 1000): null
    );
  }
}