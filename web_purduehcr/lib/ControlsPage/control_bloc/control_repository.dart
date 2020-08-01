import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';


class ControlRepository {

  final Config config;

  ControlRepository(this.config);

  Future<SystemPreference> getSettings() async {
    Map<String,dynamic> settingDoc = await callCloudFunction(config, Method.GET, "competition/settings");
    SystemPreference settings = SystemPreference.fromJson(settingDoc["settings"]);
    return settings;
  }

  updateSettings({bool isCompetitionEnabled, String competitionDisabledMessage, bool isCompetitionVisible, String competitionHiddenMessage, bool isShowingRewards}) async{
    Map<String, dynamic> body = Map();
    if(competitionHiddenMessage != null){
      body[SystemPreference.COMPETITION_HIDDEN_MESSAGE] = competitionHiddenMessage;
    }
    if(isCompetitionVisible != null){
      body[SystemPreference.IS_COMPETITION_VISIBLE] = isCompetitionVisible;
    }
    if(competitionDisabledMessage != null){
      body[SystemPreference.COMPETITION_DISABLED_MESSAGE] = competitionDisabledMessage;
    }
    if(isCompetitionEnabled != null) {
      body[SystemPreference.IS_COMPETITION_ENABLED] = isCompetitionEnabled;
    }
    if(isShowingRewards != null){
      body[SystemPreference.SHOW_REWARDS] = isShowingRewards;
    }
    await callCloudFunction(config, Method.PUT, "competition/settings", body: body);
  }

  endSemester() async {
    await callCloudFunction(config, Method.POST, "competition/endSemester");
  }

  resetCompetition() async {
    await callCloudFunction(config, Method.POST, "competition/resetCompetition");
  }

  requestBackup() async {
    await callCloudFunction(config, Method.GET, "administration/json_backup");
  }

}