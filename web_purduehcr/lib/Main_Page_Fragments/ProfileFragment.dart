//
//import 'package:flutter/cupertino.dart';
//import 'package:flutter/material.dart';
//import 'package:purduehcr_web/Models/User.dart' as PHCRUser;
//import 'package:purduehcr_web/Utilities/APIUtility.dart';
//
//
//class ProfileFragment extends StatefulWidget {
//  @override
//  State<StatefulWidget> createState() {
//    // TODO: implement createState
//    return ProfileFragmentState();
//  }
//}
//
//class ProfileFragmentState extends State<ProfileFragment>{
//
//  @override
//  Widget build(BuildContext context) {
//    // TODO: implement build
//    return SafeArea(
//      child: Row(
//        crossAxisAlignment: CrossAxisAlignment.center,
//        mainAxisAlignment: MainAxisAlignment.center,
//        children: <Widget>[
//          UserInformationCard()
//        ],
//      )
//    );
//  }
//}
//
//
//class UserInformationCard extends StatefulWidget {
//  @override
//  State<StatefulWidget> createState() {
//    // TODO: implement createState
//    return UserInformationCardState();
//  }
//}
//
//class UserInformationCardState extends State<UserInformationCard> {
//
//  PHCRUser.User user;
//
//  @override
//  void initState() {
//    super.initState();
//    user = PHCRUser.User.user;
//    updateUser();
//    updateUserRank();
//  }
//
//  /// Get the user information from the API assuming the user is logged in
//  void updateUser() async {
//    APIUtility.getUser().then((updatedUser) {
//      setState(() {
//        user = PHCRUser.User.user;
//      });
//    })
//    .catchError((err){
//      print("Err on getUser(): "+err.toString());
//      throw(err);
//    });
//
//  }
//
//  ///
//  void updateUserRank() async {
//    APIUtility.getUserRank().then((updatedUser) {
//      setState(() {
//        user = PHCRUser.User.user;
//      });
//    })
//        .catchError((err){
//      print("Err from getUserRank(): "+err.toString());
//      throw(err);
//    });
//
//  }
//
//  /// This method returns the UI view for the User card
//  Widget createUserCard(){
//    return Card(
//        child: SizedBox(
//          height: 150,
//          width: 250,
//          child: Column(
//            mainAxisAlignment: MainAxisAlignment.spaceBetween,
//            children: <Widget>[
//              Row(
//                mainAxisAlignment: MainAxisAlignment.start,
//                children: <Widget>[
//                  Column(
//                    children: <Widget>[
//                      Image.asset('assets/main_icon.png',
//                        height: 100,
//                        width: 100,),
//                      Text("Platinum - 4N")
//                    ],
//                  ),
//                  Expanded(
//                    child: Column(
//                      children: <Widget>[
//                        Text(user.firstName +" "+user.lastName),
//                        Text(user.totalPoints.toString() + " Points")
//                      ],
//                    ),
//                  )
//                ],
//              ),
//              Text("#"+user.houseRank.toString()+" Overall      #"+ user.semesterRank.toString()+" Semester")
//            ],
//          ),
//        )
//    );
//  }
//
//  @override
//  Widget build(BuildContext context) {
//    return Column(
//      mainAxisAlignment: MainAxisAlignment.center,
//      children: <Widget>[
//        createUserCard()
//      ],
//    );
//  }
//}