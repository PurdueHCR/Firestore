import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';

class HouseCompetitionCard extends StatefulWidget{
  final List<House> houses;

  const HouseCompetitionCard({Key key, this.houses}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return HouseCompetitionCardState();
  }
}

class HouseCompetitionCardState extends State<HouseCompetitionCard>{
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Text("House Competition"),
    );
  }
}