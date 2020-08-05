import 'package:charts_flutter/flutter.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';

class HouseCompetitionCard extends StatefulWidget{
  final List<House> houses;
  final SystemPreference preferences;

  const HouseCompetitionCard({Key key, this.houses, this.preferences}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return HouseCompetitionCardState();
  }
}

class HouseCompetitionCardState extends State<HouseCompetitionCard>{
  @override
  Widget build(BuildContext context) {
    Widget child;
    if(widget.houses == null || widget.houses.length == 0){
      child = Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(widget.preferences.competitionHiddenMessage,
            textAlign: TextAlign.center,
          ),
        ),
      );
    }
    else{
      child = new BarChart(
        _formatData(),
        animate: false,
      );
    }
    return Card(
      color: Theme.of(context).dialogBackgroundColor,
      child: child
    );
  }

  List<Series<House, String>> _formatData(){
    List<House> rankedHouses = new List();
    rankedHouses.add(widget.houses[3]);
    rankedHouses.add(widget.houses[1]);
    rankedHouses.add(widget.houses[0]);
    rankedHouses.add(widget.houses[2]);
    rankedHouses.add(widget.houses[4]);

    return [
      new Series<House, String>(
        id: 'House Competition',
        colorFn: (House house, __) => Color.fromHex(code: house.color),
        domainFn: (House house, _) => house.name,
        measureFn: (House house, _) => house.pointsPerResident,
        data: rankedHouses,
      )
    ];
  }
}