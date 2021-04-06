import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:bloc/bloc.dart';

class FunctionUtilities {
  /// Display a snack bar on the scaffold
  static showSnackBar(BuildContext context, Color color, String message, Bloc bloc, Equatable event, {bool popContext = false}){
    if(popContext){
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
    }
    final snackBar = SnackBar(
      backgroundColor: color,
      content:
      Text(message),
    );
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Scaffold.of(context).showSnackBar(snackBar);
      bloc.add(event);
    });
  }
}