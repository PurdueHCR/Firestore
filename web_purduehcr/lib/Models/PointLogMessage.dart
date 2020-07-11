class PointLogMessage {
  DateTime creationDate;
  String message;
  String messageType;
  String senderFirstName;
  String senderLastName;
  int senderPermissionLevel;

  PointLogMessage(this.creationDate, this.message, this.messageType, this.senderFirstName, this.senderLastName, this.senderPermissionLevel);
}