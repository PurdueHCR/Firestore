import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/User.dart';
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
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Column(
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
                    ),
                  ),
                  Text("Platinum - 4N")
                ],
              ),
              Expanded(
                child: Column(
                  children: <Widget>[
                    Text(widget.user.firstName +" "+widget.user.lastName),
                    Text(widget.user.totalPoints.toString() + " Points")
                  ],
                ),
              )
            ],
          ),
          Text("#"+widget.userRank.houseRank.toString()+" Overall      #"+ widget.userRank.semesterRank.toString()+" Semester")
        ],
      ),
    );
  }
}