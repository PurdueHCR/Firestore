import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Models/UserRank.dart';

class ProfileCard extends StatefulWidget{
  final User user;
  final UserRank userRank;

  const ProfileCard({Key key, this.user, this.userRank}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return ProfileCardState();
  }
}

class ProfileCardState extends State<ProfileCard>{
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            buildLeftWidget(),
            createHouseImage(),
            buildRightWidget()
          ],
        ),
      )

    );
  }

  Widget buildLeftWidget(){
    return Column(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(widget.user.totalPoints.toString() + " Points")
      ],
    );
  }

  Widget buildRightWidget(){
    if(widget.userRank.houseRank != null){
      return Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text("#"+widget.userRank.houseRank.toString()+" Overall"),
          Text("#"+ widget.userRank.semesterRank.toString()+" Semester"),
        ],
      );
    }
    else{
      return Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text("Your rank is hidden!")
        ],
      );
    }

  }

  Widget createHouseImage(){
    return Column(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Container(
            width: 100,
            height: 100,
            child: FutureBuilder(
              future: widget.user.getHouseDownloadURL(),
              builder: (context, snapshot){
                if(snapshot.connectionState == ConnectionState.none && !snapshot.hasData){
                  return Image.asset('assets/main_icon.png',
                    height: 100,
                    width: 100,);
                }
                else{
                  return Container(
                    width: 100,
                    height: 100,
                    child: Image.network((snapshot.data as Uri).toString()),
                  );
                }
              },
            )
        ),
        Text(widget.user.house +" - "+widget.user.floorId)
      ],
    );
  }
}