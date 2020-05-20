import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Models/UserRank.dart';

import '../../Utilities/HttpUtility.dart';
import 'overview.dart';

class OverviewRepository {

  Future<OverviewState> getUserOverview(UserPermissionLevel permissionLevel, String token){
    switch(permissionLevel){
      case UserPermissionLevel.RESIDENT:
        return _getResidentOverview(token);
      case UserPermissionLevel.RHP:
      case UserPermissionLevel.PROFESSIONAL_STAFF:
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.PRIVILEGED_USER:
      case UserPermissionLevel.NHAS:
      default:
        return Future.error(UnimplementedError());
    }
  }

  ///Call the api to get the information for the resident overview
  Future<ResidentOverviewLoaded> _getResidentOverview(String token){
    return Network.get("competition/residentProfile", token).then((residentOverview) {
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
      return Future.value(ResidentOverviewLoaded(rank: rank, logs: recentSubmissions, reward: nextReward, houses: houses));
    });
  }
}