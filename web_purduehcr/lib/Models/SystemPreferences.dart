import 'dart:core';

import 'package:meta/meta.dart';

class SystemPreference {

  static const String IS_COMPETITION_ENABLED = "isCompetitionEnabled";
  static const String COMPETITION_DISABLED_MESSAGE = "competitionDisabledMessage";
  static const String IS_COMPETITION_VISIBLE = "isCompetitionVisible";
  static const String COMPETITION_HIDDEN_MESSAGE = "competitionHiddenMessage";

  bool isCompetitionEnabled;
  bool isCompetitionVisible;
  String competitionDisabledMessage;
  String competitionHiddenMessage;


  SystemPreference({this.isCompetitionEnabled, this.isCompetitionVisible, this.competitionDisabledMessage, this.competitionHiddenMessage});

  factory SystemPreference.fromJson(Map<String, dynamic> json){
    return SystemPreference(
        isCompetitionEnabled: json[IS_COMPETITION_ENABLED],
        isCompetitionVisible: json[IS_COMPETITION_VISIBLE],
        competitionDisabledMessage: json[COMPETITION_DISABLED_MESSAGE],
        competitionHiddenMessage: json[COMPETITION_HIDDEN_MESSAGE]
    );
  }

}
