import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/House.dart';
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
      case UserPermissionLevel.PRIVILEGED_USER:
      return _getPrivilegeResidentOverview();
      case UserPermissionLevel.PROFESSIONAL_STAFF:
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.NHAS:
      default:
        return Future.error(UnimplementedError());
    }
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getResidentOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "competition/userOverview"));
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
    return ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses);
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getRHPOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "competition/userOverview"));
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
    return ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses);
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getPrivilegeResidentOverview() async {
    Map<String,dynamic> data = (await callCloudFunction(config, Method.GET, "competition/userOverview"));
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
    return ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses);
  }
}