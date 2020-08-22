import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Models/UserRank.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';

import 'overview.dart';

class OverviewRepository {

  final Config config;

  OverviewRepository(this.config);



  Future<OverviewState> getUserOverview( UserPermissionLevel permissionLevel){
    switch(permissionLevel){
      case UserPermissionLevel.RESIDENT:
        return _getResidentOverview();
      case UserPermissionLevel.RHP:
      return _getRHPOverview();
      case UserPermissionLevel.PRIVILEGED_RESIDENT:
      return _getPrivilegeResidentOverview();
      case UserPermissionLevel.PROFESSIONAL_STAFF:
        return _getProfessionalStaffLoaded();
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.EXTERNAL_ADVISER:
      default:
        return Future.error(UnimplementedError());
    }
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getResidentOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "web/userOverview"));
    Map<String,dynamic> residentOverview = data["resident"];
    UserRank rank = UserRank.fromJson(residentOverview["user_rank"]);
    Reward nextReward = Reward.fromJson(residentOverview["next_reward"]);

    Set<Map<String, dynamic>> submissions = Set.from(residentOverview["last_submissions"]);
    List<PointLog> recentSubmissions = new List();
    submissions.forEach((element) {
      recentSubmissions.add(PointLog.fromJson(element));
    });

    Set<Map<String, dynamic>> houseList = Set.from(residentOverview["houses"]);
    List<House> houses = new List();
    houseList.forEach((element) {
      houses.add(House.fromJson(element));
    });
    House myHouse = House.fromJson(residentOverview["user_house"]);
    return ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses, myHouse:myHouse, key: UniqueKey());
  }

  ///Call the api to get the information for the resident overview
  Future<RHPOverviewLoaded> _getRHPOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "web/userOverview"));
    Map<String,dynamic> residentOverview = data["rhp"];
    UserRank rank = UserRank.fromJson(residentOverview["user_rank"]);
    Reward nextReward = Reward.fromJson(residentOverview["next_reward"]);

    Set<Map<String, dynamic>> submissions = Set.from(residentOverview["last_submissions"]);
    List<PointLog> recentSubmissions = new List();
    submissions.forEach((element) {
      recentSubmissions.add(PointLog.fromJson(element));
    });

    Set<Map<String, dynamic>> houseList = Set.from(residentOverview["houses"]);
    List<House> houses = new List();
    houseList.forEach((element) {
      houses.add(House.fromJson(element));
    });

    Set<Map<String, dynamic>> houseCodeResponse = Set.from(residentOverview["house_codes"]);
    List<HouseCode> houseCodes = new List();
    houseCodeResponse.forEach((element) {
      houseCodes.add(HouseCode.fromJson(element));
    });
    House myHouse = House.fromJson(residentOverview["user_house"]);
    return RHPOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses, houseCodes: houseCodes, myHouse: myHouse, key: UniqueKey());
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getPrivilegeResidentOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "web/userOverview"));
    Map<String,dynamic> residentOverview = data["privilege_resident"];
    UserRank rank = UserRank.fromJson(residentOverview["user_rank"]);
    Reward nextReward = Reward.fromJson(residentOverview["next_reward"]);

    Set<Map<String, dynamic>> submissions = Set.from(residentOverview["last_submissions"]);
    List<PointLog> recentSubmissions = new List();
    submissions.forEach((element) {
      recentSubmissions.add(PointLog.fromJson(element));
    });

    Set<Map<String, dynamic>> houseList = Set.from(residentOverview["houses"]);
    List<House> houses = new List();
    houseList.forEach((element) {
      houses.add(House.fromJson(element));
    });
    House myHouse = House.fromJson(residentOverview["user_house"]);

    return ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses, key: UniqueKey(), myHouse: myHouse);
  }

  Future<ProfessionalStaffLoaded> _getProfessionalStaffLoaded() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "web/userOverview"));
    Map<String,dynamic> residentOverview = data["professional_staff"];


    Set<Map<String, dynamic>> houseList = Set.from(residentOverview["houses"]);
    List<House> houses = new List();
    houseList.forEach((element) {
      houses.add(House.fromJson(element));
    });
    return ProfessionalStaffLoaded(houses: houses);
  }

  grantHouseAward(String house, String description, double pointsPerResident) async {
    Map<String, dynamic> body = new Map();
    body["house"] = house;
    body["description"] = description;
    body["ppr"] = pointsPerResident;
    await callCloudFunction(config, Method.POST, "competition/houseAward", body: body);
  }

  updateHouse(String house, {String description, int numberOfResidents}) async {
    Map<String, dynamic> body = new Map();
    body["house"] = house;
    if(description != null){
      body["description"] = description;
    }
    if(numberOfResidents != null){
      body["numberOfResidents"] = numberOfResidents;
    }
    await callCloudFunction(config, Method.POST, "competition/updateHouse", body: body);
  }

}