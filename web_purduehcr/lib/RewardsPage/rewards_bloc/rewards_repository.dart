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

  /// Update the user model. Only the Professional staff can fill all these fields. Check the API doc for more information
  updateReward(Reward reward, { String name, String fileName, String downloadURL, double pointsPerResident}) async {
    Map<String, dynamic> body = Map();
    body["id"] = reward.id;
    if(name != null){
      body[Reward.NAME] = name;
    }
    if(fileName != null){
      body[Reward.FILE_NAMe] = fileName;
    }
    if(downloadURL != null){
      body[Reward.DOWNLOAD_RUL] = downloadURL;
    }
    if(pointsPerResident != null){
      body[Reward.REQUIRED_PPR] = pointsPerResident;
    }
    await callCloudFunction(config, Method.PUT, "rewards/", body: body);
  }

  deleteReward(Reward reward) async {
    Map<String, dynamic> body = Map();
    body["id"] = reward.id;
    await callCloudFunction(config, Method.DELETE, "rewards/", body: body);
  }

}