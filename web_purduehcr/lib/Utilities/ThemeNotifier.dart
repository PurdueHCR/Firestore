import 'package:flutter/material.dart';

class ThemeNotifier with ChangeNotifier {




  ThemeData _themeData;
  ThemeData _darkThemeData;
  Color _mainColor;

  ThemeNotifier(this._themeData, this._darkThemeData);

  getTheme() => _themeData;

  getDarkTheme() => _darkThemeData;

  setTheme(ThemeData themeData) async {
    _themeData = themeData;
    notifyListeners();
  }

  getMainColor() => _mainColor;

  /// Change the main color of the app.
  /// Color color - the new color to use
  /// bool shouldRebuild - Should rebuild the view
  setMainColor(Color color, {bool shouldRebuild = true}) async {
    this._mainColor = color;
    _themeData = _createNewTheme(color);
    _darkThemeData = _createNewDarkTheme(color);
    if(shouldRebuild){
      notifyListeners();
    }
  }


  ThemeData _createNewDarkTheme(Color color){
    return ThemeData(
      primaryColor: Colors.black54,
      brightness: Brightness.dark,
      backgroundColor: Colors.black26,
      accentColor: color,
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
  }

  ThemeData _createNewTheme(Color color){
    return ThemeData(
        primaryColor: color,
        accentColor: color
    );
  }
}