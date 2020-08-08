import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:linkable/linkable.dart';
import 'package:purduehcr_web/authentication/authentication.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:url_launcher/url_launcher.dart';

const _DrawerOptions OVERVIEW = _DrawerOptions("Overview","/",Icon(Icons.account_circle));
const _DrawerOptions SUBMIT_POINTS = _DrawerOptions("Submit Points","/submit_points",Icon(Icons.add));
const _DrawerOptions HANDLE_POINTS = _DrawerOptions("Handle Points","/handle_points",Icon(Icons.message));
const _DrawerOptions MY_POINTS = _DrawerOptions("My Points","/my_points",Icon(Icons.list));
const _DrawerOptions HISTORY = _DrawerOptions("House History","/house_history",Icon(Icons.history));
const _DrawerOptions TOKEN = _DrawerOptions("Token","/token",Icon(Icons.add));
const _DrawerOptions LINKS = _DrawerOptions("Links", "/links", Icon(Icons.link));
const _DrawerOptions CONTROLS = _DrawerOptions("Controls", "/controls", Icon(Icons.build));
const _DrawerOptions POINT_TYPE_CONTROLS = _DrawerOptions("Point Categories", "/point_type_controls", Icon(Icons.list));
const _DrawerOptions HOUSE_CODES = _DrawerOptions("House Codes", "/house_codes", Icon(Icons.home));
const _DrawerOptions FIND_USERS = _DrawerOptions("Find Users", "/find_users", Icon(Icons.search));
const _DrawerOptions REWARDS = _DrawerOptions("Rewards", "/rewards", Icon(Icons.cake));

const List<_DrawerOptions> RESIDENT_LIST = [OVERVIEW, SUBMIT_POINTS, MY_POINTS, TOKEN];
const List<_DrawerOptions> RHP_LIST = [OVERVIEW, SUBMIT_POINTS, MY_POINTS, HANDLE_POINTS, LINKS, HISTORY];
const List<_DrawerOptions> PROFESSIONAL_STAFF_LIST = [OVERVIEW, LINKS, HISTORY, HOUSE_CODES, POINT_TYPE_CONTROLS, REWARDS, FIND_USERS, CONTROLS];
const List<_DrawerOptions> FHP_LIST = [OVERVIEW, LINKS];
const List<_DrawerOptions> PRIVILEGED_USER_LIST = [OVERVIEW, SUBMIT_POINTS, MY_POINTS, LINKS];
const List<_DrawerOptions> EA_LIST = [OVERVIEW, LINKS];


class PhcrDrawer extends Drawer {

  final String selectedPageName;
  final double elevation;
  const PhcrDrawer(this.selectedPageName,{this.elevation = 16.0}): super();


  @override
  Widget build(BuildContext context) {
    List<_DrawerOptions> selectedList = RESIDENT_LIST;
    User user = (BlocProvider.of<AuthenticationBloc>(context).state as Authenticated).user;
    switch(user.permissionLevel){

      case UserPermissionLevel.RESIDENT:
        selectedList = RESIDENT_LIST;
        break;
      case UserPermissionLevel.RHP:
        selectedList = RHP_LIST;
        break;
      case UserPermissionLevel.PROFESSIONAL_STAFF:
        selectedList = PROFESSIONAL_STAFF_LIST;
        break;
      case UserPermissionLevel.FHP:
        selectedList = FHP_LIST;
        break;
      case UserPermissionLevel.PRIVILEGED_RESIDENT:
        selectedList = PRIVILEGED_USER_LIST;
        break;
      case UserPermissionLevel.EXTERNAL_ADVISER:
        selectedList = EA_LIST;
        break;
    }

    String permissionName = UserPermissionLevelConverter.convertPermissionToString(user.permissionLevel);
    String accountDetails = "";
    if(user.isCompetitionParticipant()){
      accountDetails = user.house+ " House: " +user.floorId+" "+permissionName;
    }
    else if(user.permissionLevel == UserPermissionLevel.FHP){
      accountDetails = user.house+" "+permissionName;
    }
    else{
      accountDetails = permissionName;
    }

    Widget houseIcon;
    if(user.isCompetitionParticipant()){
      houseIcon = FutureBuilder(
        future: user.getHouseDownloadURL(),
        builder: (context, snapshot){
          if(snapshot.connectionState == ConnectionState.none && !snapshot.hasData){
            return Image.asset('assets/main_icon.png');
          }
          else{
            return Image.network((snapshot.data as Uri).toString());
          }
        },
      );
    }
    else {
      houseIcon = Image.network(BlocProvider.of<AuthenticationBloc>(context).state.preferences.defaultImageURL);
    }

    return Drawer(
      elevation: this.elevation,
      child: Container(
        child: ListView.builder(
            itemCount: selectedList.length + 4,
            itemBuilder: (BuildContext context, int index) {
              if(index == 0){
                return UserAccountsDrawerHeader(
                  accountName: Text(user.firstName+ ' '+user.lastName),
                  accountEmail: Text(accountDetails),
                  currentAccountPicture: CircleAvatar(
                    backgroundColor: Colors.white,
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: houseIcon,
                    )
                  ),
                );
              }
              else if(index == selectedList.length + 1 ){
                return Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                  child: OutlineButton(
                      child: Text("Log out"),
                      onPressed: (){
                        showDialog(
                            context: context,
                            child: AlertDialog(
                              title: Text("Log Out"),
                              content: Text("Are you sure you want to log out?"),
                              actions: [
                                FlatButton(
                                  child: Text("Cancel"),
                                  onPressed: (){
                                    Navigator.of(context).pop();
                                  },
                                ),
                                FlatButton(
                                  child: Text("Log out"),
                                  onPressed: (){
                                    Navigator.of(context).pop();
                                    BlocProvider.of<AuthenticationBloc>(context).add(LoggedOut());
                                  },
                                )
                              ],
                            )
                        );
                      }
                  ),
                );
              }
              else if(index == selectedList.length + 2){
                return Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                  child: OutlineButton(
                      child: Text("Report Bug"),
                      onPressed: (){
                        showDialog(
                            context: context,
                            child: AlertDialog(
                              title: Text("Report a Bug"),
                              content: Linkable(
                                text: "To report a bug, please fill out the survey here: https://forms.gle/joentx244RnKy5Fe9",
                              ),
                            )
                        );
                      }
                  ),
                );
              }
              else if(index == selectedList.length + 3){
                return Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                  child: IconButton(
                      icon: Icon(Icons.info_outline),
                      onPressed: (){
                        showDialog(
                            context: context,
                            child: AlertDialog(
                              title: Text("App Information"),
                              content: SizedBox(
                                width: 400,
                                child: SingleChildScrollView(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                        children: [
                                          OutlineButton(
                                            child: Text("Privacy Policy"),
                                            onPressed: () async {
                                              await launch('/privacy/');
                                            },
                                          ),
                                          OutlineButton(
                                            child: Text("Terms and Conditions"),
                                            onPressed: () async {
                                              await launch('/terms-and-conditions/');
                                            },
                                          ),
                                        ],
                                      ),
                                      Text(APP_INFO_DESCRIPTION),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          OutlineButton(
                                            child: Text("Join Slack"),
                                            onPressed: () async {
                                              await launch('https://join.slack.com/t/purduehcr/shared_invite/zt-96fxky0h-dp6ceejRxF_CkPjmLROVhA');
                                            },
                                          ),
                                        ],
                                      ),
                                      Linkable(
                                        text: APP_CONTACT_INFO,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            )
                        );
                      }
                  ),
                );
              }
              else{
                return ListTile(
                  enabled: true,
                  selected: selectedPageName == selectedList[index - 1].name,
                  leading: selectedList[index - 1].icon,
                  title: Text(
                      selectedList[index - 1].name,
                  ),
                  onTap: () {
                    if(!(selectedPageName == selectedList[index - 1].name))
                      Navigator.of(context).pushReplacementNamed(selectedList[index - 1].path);
                  },
                );
              }
            })
      ),
    );
  }
}

class _DrawerOptions {
  final Icon icon;
  final String name;
  final String path;
  const _DrawerOptions(this.name,this.path, this.icon);
}

const String APP_INFO_DESCRIPTION = "This app is maintained by the PurdueHCR Development Committee. The PurdueHCR Development Committee is a group of students interested in application development and is open for everyone to join.\nIf you are interested in joining, you can join our slack channel.\n";
const String APP_CONTACT_INFO = "Contact Information:\n\tPurdueHCR: purduehcrcontact@gmail.com\n\nCommittee President\n\tBen Hardin: hardin30@purdue.edu\nResidential Life Adviser\n\tAsa Cutler: cutler4@purdue.edu\nFlutter Developer\n\tBrian Johncox: brianjohncox232@gmail.com";
