import 'package:flutter/material.dart';

class ThemeNotifier with ChangeNotifier {

  static final darkTheme = ThemeData(
    primarySwatch: Colors.grey,
    primaryColor: Colors.black,
    brightness: Brightness.dark,
    backgroundColor: const Color(0xFF212121),
    accentColor: Colors.white,
    accentIconTheme: IconThemeData(color: Colors.black),
    dividerColor: Colors.black12,
  );

  static final platinumTheme = ThemeData(
    primaryColor: const Color(0xFF5AC0C7),
    brightness: Brightness.dark,
    backgroundColor: const Color(0xFFFFEDDF),
    accentColor: const Color(0xFF5AC0C7),
    accentIconTheme: IconThemeData(color: const Color(0xFFFAFFD8)),
    dividerColor: Colors.black12,
    canvasColor: const Color(0xFF1B2845),
    dialogBackgroundColor: Colors.white,
    textTheme: TextTheme(
      headline1: TextStyle(color: Colors.black),
      bodyText2: TextStyle(color: Colors.black),
      subtitle1: TextStyle(color: Colors.black),
      caption: TextStyle(color: Colors.black),
      button: TextStyle(color: Colors.black),
      overline: TextStyle(color: Colors.black),
    )
//    canvasColor: const Color(0xFF242038)
  );

  ThemeData _themeData;

  ThemeNotifier(this._themeData);

  getTheme() => _themeData;

  setTheme(ThemeData themeData) async {
    _themeData = themeData;
    notifyListeners();
  }
}