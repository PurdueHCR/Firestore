
class DateUtils {

  ///Converts DateTime to ISO format
  ///Output: 2020-09-16T20:41:09.331+05:30
  static String formatISOTime(DateTime date) {
    var duration = date.timeZoneOffset;
    if (duration.isNegative)
      return (date.toIso8601String() +
          "-${duration.inHours.abs().toString().padLeft(2, '0')}:${(duration.inMinutes - (duration.inHours * 60)).toString().padLeft(2, '0')}");
    else
      return (date.toIso8601String() +
          "+${duration.inHours.toString().padLeft(2, '0')}:${(duration.inMinutes - (duration.inHours * 60)).toString().padLeft(2, '0')}");
  }

  ///get ISO time String from DateTime
  ///Output: 2020-09-16T20:42:38.629+05:30
  static String getCurrentISOTimeString({DateTime dateTime}) {
    var date = dateTime ?? DateTime.now();
    //Time zone may be null in dateTime hence get timezone by  datetime
    var duration = DateTime.now().timeZoneOffset;
    if (duration.isNegative)
      //TODO: convert duration to abs value instead of below params
      return (date.toIso8601String() +
          "-${duration.inHours.abs().toString().padLeft(2, '0')}:${(duration.inMinutes.abs() - (duration.inHours.abs() * 60)).toString().padLeft(2, '0')}");
    else
      return (date.toIso8601String() +
          "+${duration.inHours.toString().padLeft(2, '0')}:${(duration.inMinutes - (duration.inHours * 60)).toString().padLeft(2, '0')}");
  }
}
