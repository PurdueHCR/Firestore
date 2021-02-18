import 'package:json_annotation/json_annotation.dart';

part 'Config.g.dart';

@JsonSerializable(createToJson: false)
class Config {
  final String env;
  final String apiKey;
  final String authDomain;
  final String databaseURL;
  final String projectId;
  final String storageBucket;
  final String version = "1.1.0";

  Config({this.env, this.apiKey, this.authDomain, this.databaseURL, this.projectId, this.storageBucket});
  factory Config.fromJson(Map<String, dynamic> json) => _$ConfigFromJson(json);

  @override
  String toString() {
    return "ENV: "+env + " "+ projectId;
  }
}