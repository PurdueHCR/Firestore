import 'package:flutter/material.dart';
import 'package:purduehcr_web/User_Login_Creation/JoinHouseCard.dart';


class JoinHousePage extends StatelessWidget {
  const JoinHousePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color.fromARGB(255, 220, 220, 220),
        body: Center(
          child: Container(
            width: MediaQuery.of(context).size.width * 0.22,
            height: MediaQuery.of(context).size.height * 0.4,
            child: JoinHouseCard(),
          ),
        )
    );
  }
}