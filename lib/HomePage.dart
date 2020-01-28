import 'package:flutter/material.dart';
import 'package:purduehcr_web/SignInCard.dart';


class HomePage extends StatelessWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SignInCard(),
    );
  }
}