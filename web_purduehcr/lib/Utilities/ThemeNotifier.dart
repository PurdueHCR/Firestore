import 'package:flutter/material.dart';

class ThemeNotifier with ChangeNotifier {

  static final darkTheme = ThemeData(
    primaryColor: Colors.black54,
    brightness: Brightness.dark,
    backgroundColor: Colors.black26,
    accentColor: const Color(0xFF5AC0C7),
    canvasColor: Colors.black45,
    appBarTheme: AppBarTheme(color: Colors.black45, ),
    cardColor: Colors.white,

    textTheme: TextTheme(
      headline1: TextStyle(color: Colors.black),
      bodyText2: TextStyle(color: Colors.black),
      subtitle1: TextStyle(color: Colors.black),
      caption: TextStyle(color: Colors.black),
      button: TextStyle(color: Colors.black),
      overline: TextStyle(color: Colors.black),
      bodyText1: TextStyle(color: Colors.black),
      subtitle2: TextStyle(color: Colors.black),
      headline2: TextStyle(color: Colors.white)
    ),
    focusColor: Colors.black,
    iconTheme: IconThemeData(color: Colors.black),
  );

  static final lightTheme = ThemeData(

    primaryColor: const Color(0xFF5AC0C7),
    accentColor: const Color(0xFF5AC0C7)
  );




  ThemeData _themeData;

  ThemeNotifier(this._themeData);

  getTheme() => _themeData;

  setTheme(ThemeData themeData) async {
    _themeData = themeData;
    notifyListeners();
  }
}