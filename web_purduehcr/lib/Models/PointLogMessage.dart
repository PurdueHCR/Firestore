
import 'package:purduehcr_web/Models/User.dart';

class PointLogMessage {
  DateTime creationDate;
  String message;
  String messageType;
  String senderFirstName;
  String senderLastName;
  int senderPermissionLevel;

  PointLogMessage({this.creationDate, this.message, this.messageType, this.senderFirstName, this.senderLastName, this.senderPermissionLevel});

  factory PointLogMessage.fromJson(Map<String, dynamic> json){
    return PointLogMessage(
      creationDate: DateTime.fromMicrosecondsSinceEpoch((json["creationDate"]["_seconds"] as int) * 1000000),
      message: json["message"],
      messageType: json["messageType"],
      senderFirstName: json["senderFirstName"],
      senderLastName: json["senderLastName"],
      senderPermissionLevel: json["senderPermissionLevel"]
    );
  }

  static PointLogMessage createApproveMessage(User user){
    return PointLogMessage(
        creationDate: DateTime.now(),
        message: "${user.getFullName()} approved this point.",
        messageType: "approve",
        senderFirstName: "Purdue",
        senderLastName: "HCR",
        senderPermissionLevel: 1
    );
  }

  static PointLogMessage createRejectionMessage(User user, String message){
    if(!(message.endsWith(".") || message.endsWith("?") || message.endsWith("!"))){
      message += ".";
    }
    return PointLogMessage(
        creationDate: DateTime.now(),
        message: "${user.getFullName()} rejected this point submission with the reason: $message",
        messageType: "reject",
        senderFirstName: "Purdue",
        senderLastName: "HCR",
        senderPermissionLevel: 1
    );
  }
}