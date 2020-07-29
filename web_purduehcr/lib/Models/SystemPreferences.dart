import 'dart:core';

import 'package:meta/meta.dart';

class SystemPreference {

  static const String IS_COMPETITION_ENABLED = "isCompetitionEnabled";
  static const String COMPETITION_DISABLED_MESSAGE = "competitionDisabledMessage";
  static const String IS_COMPETITION_VISIBLE = "isCompetitionVisible";
  static const String COMPETITION_HIDDEN_MESSAGE = "competitionHiddenMessage";
  static const String DEFAULT_IMAGE_URL = "defaultImageURL";
  static const String DEFAULT_IMAGE_NAME = "defaultImageName";

  bool isCompetitionEnabled;
  bool isCompetitionVisible;
  String competitionDisabledMessage;
  String competitionHiddenMessage;
  String defaultImageURL;
  String defaultImageName;


  SystemPreference({this.isCompetitionEnabled, this.isCompetitionVisible, this.competitionDisabledMessage, this.competitionHiddenMessage, this.defaultImageName, this.defaultImageURL});

  factory SystemPreference.fromJson(Map<String, dynamic> json){
    return SystemPreference(
        isCompetitionEnabled: json[IS_COMPETITION_ENABLED],
        isCompetitionVisible: json[IS_COMPETITION_VISIBLE],
        competitionDisabledMessage: json[COMPETITION_DISABLED_MESSAGE],
        competitionHiddenMessage: json[COMPETITION_HIDDEN_MESSAGE],
        defaultImageName: json[DEFAULT_IMAGE_NAME],
        defaultImageURL: json[DEFAULT_IMAGE_URL]
    );
  }

}
