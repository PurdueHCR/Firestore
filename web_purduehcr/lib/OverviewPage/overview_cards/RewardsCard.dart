import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/Reward.dart';

class RewardsCard extends StatefulWidget{
  final Reward reward;
  final House house;

  const RewardsCard({Key key, this.reward, this.house}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return RewardsCardState();
  }
}

class RewardsCardState extends State<RewardsCard>{
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Text("Rewards"),
    );
  }
}