/*
This widget is the universal loading widget for this app. It is a stateful
widget so that in the future, we can come back and add cool animations to it.
 */

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LoadingWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _LoadingWidgetState();
  }

}

class _LoadingWidgetState extends State<LoadingWidget>{
  @override
  Widget build(BuildContext context) {

    return SizedBox(
      width: 100,
      height: 100,
      child: CircularProgressIndicator()
    );
  }

}