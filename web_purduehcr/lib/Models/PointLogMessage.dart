
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
      creationDate: json["creationDate"],
      message: json["message"],
      messageType: json["messageTye"],
      senderFirstName: json["senderFirstName"],
      senderLastName: json["senderLastName"],
      senderPermissionLevel: json["senderPermissionLevel"]
    );
  }

  static PointLogMessage createApproveMessage(){
    return PointLogMessage(
        creationDate: DateTime.now(),
        message: "This submission has been approved!",
        messageType: "approve",
        senderFirstName: "Purdue",
        senderLastName: "HCR",
        senderPermissionLevel: 1
    );
  }

  static PointLogMessage createRejectionMessage(){
    return PointLogMessage(
        creationDate: DateTime.now(),
        message: "This submission has been rejected.",
        messageType: "reject",
        senderFirstName: "Purdue",
        senderLastName: "HCR",
        senderPermissionLevel: 1
    );
  }
}