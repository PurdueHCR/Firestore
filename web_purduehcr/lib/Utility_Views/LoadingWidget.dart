/*
This widget is the universal loading widget for this app. It is a stateful
widget so that in the future, we can come back and add cool animations to it.
 */

import 'dart:math';

import 'package:flutter/material.dart';

class LoadingWidget extends StatefulWidget {
  final images = ['loading_icons/copper.png','loading_icons/palladium.png','loading_icons/platinum.png','loading_icons/silver.png','loading_icons/titanium.png'];
  @override
  State<StatefulWidget> createState() {
    return _LoadingWidgetState();
  }

}

class _LoadingWidgetState extends State<LoadingWidget> with SingleTickerProviderStateMixin{

  AnimationController controller;
  Animation flipAnimation;
  int position = 0;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
        duration: Duration(milliseconds: 2000),
      vsync: this,
    );
    flipAnimation = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(
      parent: controller,
      curve: Interval(0.0,1.0,curve: Curves.linear)
    )..addListener(() {
      if(flipAnimation.value <= 0.755 && flipAnimation.value >= 0.745){
        setState(() {
          position = (position + 1)%5;
        });
      }
    })
    );
    position = Random().nextInt(5);
  }

  @override
  Widget build(BuildContext context) {
    if(!controller.isAnimating){
      controller.repeat();
    }

    return Center(
      child: AnimatedBuilder(
        animation: controller,
          builder: (BuildContext context, Widget child){
            Image img = Image.asset("assets/${widget.images[position]}");
            return Container(
              height: 150,
                width: 150,
              child: Transform(
                transform: Matrix4.identity()
                    ..rotateY(2*pi*flipAnimation.value),
                alignment: Alignment.center,
                child: Card(
                  child: SizedBox(
                      width: 150,
                      height: 150,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: AspectRatio(
                          aspectRatio: 1,
                          child: img,
                        ),
                      )
                  ),
                ),
              ),
            );
          },
      )
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}