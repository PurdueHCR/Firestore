import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BLoCs/authentication/authentication.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

const _DrawerOptions OVERVIEW = _DrawerOptions("Overview","/",Icon(Icons.account_circle));
const _DrawerOptions SUBMIT_POINTS = _DrawerOptions("Submit Points","/submit_points",Icon(Icons.add));

const List<_DrawerOptions> RESIDENT_LIST = [OVERVIEW,SUBMIT_POINTS];
const List<_DrawerOptions> RHP_LIST = [OVERVIEW,SUBMIT_POINTS];
const List<_DrawerOptions> PROFESSIONAL_STAFF_LIST = [OVERVIEW];
const List<_DrawerOptions> FHP_LIST = [OVERVIEW];
const List<_DrawerOptions> PRIVILEGED_USER_LIST = [OVERVIEW,SUBMIT_POINTS];
const List<_DrawerOptions> NHAS_LIST = [OVERVIEW];

class PhcrDrawer extends Drawer {

  final String selectedPageName;
  final double elevation;
  const PhcrDrawer(this.selectedPageName,{this.elevation = 16.0}): super();



  @override
  Widget build(BuildContext context) {
    List<_DrawerOptions> selectedList = RESIDENT_LIST;
    User user = (BlocProvider.of<AuthenticationBloc>(context).state as AuthenticationAuthenticated).user;
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
      case UserPermissionLevel.PRIVILEGED_USER:
        selectedList = PRIVILEGED_USER_LIST;
        break;
      case UserPermissionLevel.NHAS:
        selectedList = NHAS_LIST;
        break;
    }
    return Drawer(
      elevation: this.elevation,
      child: SafeArea(
        child: ListView.builder(
            itemCount: selectedList.length + 2,
            itemBuilder: (BuildContext context, int index) {
              if(index == 0){
                return UserAccountsDrawerHeader(
                  decoration: BoxDecoration(
                    color: Colors.blue,
                  ),
                  accountName: Text(user.firstName+ ' '+user.lastName),
                  accountEmail: Text(user.house+' - '+user.floorId),
                  currentAccountPicture: CircleAvatar(
                    backgroundColor: Colors.white,
                    child: FutureBuilder(
                      future: user.getHouseDownloadURL(),
                      builder: (context, snapshot){
                        if(snapshot.connectionState == ConnectionState.none && !snapshot.hasData){
                          return Image.asset('assets/main_icon.png');
                        }
                        else{
                          return Image.network((snapshot.data as Uri).toString());
                        }
                      },
                    ),
                  ),
                );
              }
              else if(index == selectedList.length + 2 - 1){
                return FlatButton(
                    child: Text("Loggout"),
                    onPressed: (){
                      BlocProvider.of<AuthenticationBloc>(context).add(LoggedOut());
                    }
                );
              }
              else{
                return ListTile(
                  enabled: true,
                  selected: selectedPageName == selectedList[index - 1].name,
                  leading: selectedList[index - 1].icon,
                  title: Text(
                      selectedList[index - 1].name
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
