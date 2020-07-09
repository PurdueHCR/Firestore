import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: AspectRatio(
              aspectRatio: 1,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: new CircularProgressIndicator(
                      strokeWidth: 10,
                      valueColor: new AlwaysStoppedAnimation<Color>(widget.house.getHouseColor()),
                      value: widget.house.pontsPerResident/ widget.reward.requiredPPR,
                    ),
                  ),
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(15.0),
                      child: FutureBuilder(
                        future: widget.reward.getDownloadURL(),
                        builder: (context, snapshot){
                          if(snapshot.connectionState == ConnectionState.done){
                            return Image(
                              image: NetworkImage(snapshot.data.toString()),

                            );
                          }
                          else{
                            return LoadingWidget();
                          }
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Spacer(),
              Text("Next Reward"),
              Text(widget.reward.name),
              Spacer(),
              Text(widget.house.pontsPerResident.toString()+ " / "+widget.reward.requiredPPR.toString()),
              Text("Points Per Resident", maxLines: null,),
              Spacer(),
            ],
          )
        ],
      ),
    );
  }
}