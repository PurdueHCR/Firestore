import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class RewardsRepository {

  final Config config;

  RewardsRepository(this.config);

  Future<List<Reward>> getRewards() async {
    Map<String,dynamic> rewardsJson = await callCloudFunction(config, Method.GET, "rewards/");
    Set<Map<String, dynamic>> rewardsSetJson = Set.from(rewardsJson["rewards"]);
    List<Reward> rewards = new List();
    rewardsSetJson.forEach((element) {
      rewards.add(Reward.fromJson(element));
    });
    return rewards;
  }

  Future<Reward> createReward(String name, String fileName, String imageURL, int pointsPerResident) async {
    Map<String, dynamic> rewardJson = await callCloudFunction(config, Method.POST, "rewards/", body: {"name":name, "fileName": fileName, "downloadURL":imageURL, "requiredPPR":pointsPerResident});
    return Reward.fromJson(rewardJson);
  }

}