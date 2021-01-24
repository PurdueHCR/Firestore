import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';


class MyEventsRepository {

  final Config config;

  MyEventsRepository(this.config);

/*
  Examples for retrieving data and submitting an update

  Future<List<PointType>> getPointTypes() async {
    Map<String,dynamic> pointTypeList = await callCloudFunction(config, Method.GET, "point_type/submittable");
    Set<Map<String, dynamic>> pointTypes = Set.from(pointTypeList["point_types"]);
    List<PointType> pts = new List();
    pointTypes.forEach((element) {
      pts.add(PointType.fromJson(element));
    });
    return pts;
  }

  Future submitPoint(String description, DateTime dateOccurred, int pointTypeId) async {
    Map<String, dynamic> body = {"description": description, "date_occurred":dateOccurred.toString(), "point_type_id":pointTypeId};
    await callCloudFunction(config, Method.POST, "user/submitPoint", body: body);
  }
*/
}