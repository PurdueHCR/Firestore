import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';


class UserList extends StatefulWidget{
  final List<User> user;
  final Function(BuildContext, User user) onPressed;
  final Function( User user) onSwipe;
  final bool searchable;
  final bool showLoadMoreButton;
  final Function loadMore;
  final bool shrinkWrap;

  const UserList({Key key, @required this.user, @required this.onPressed, this.searchable = true, this.onSwipe,  this.showLoadMoreButton = false, this.loadMore, this.shrinkWrap = false}):super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HouseCodeListState();
  }

}

class _HouseCodeListState extends State<UserList>{
  List<User> visibleUsers;

  @override
  void initState() {
    super.initState();
    visibleUsers = widget.user;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleUsers.isEmpty){
      mainContent = Center(
        child: Text("No Users Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        shrinkWrap: widget.shrinkWrap,
        itemCount: (this.widget.showLoadMoreButton)? visibleUsers.length + 1 : visibleUsers.length,
        itemBuilder: (BuildContext context, int index){
          if(index == visibleUsers.length){
            return OutlineButton(
              child: Text("Load More"),
              onPressed: this.widget.loadMore,
            );
          }
          else{
            return Card(
              child: UserListTile(user: visibleUsers[index], onTap: widget.onPressed, onSwipe: widget.onSwipe,),
            );
          }
        },
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
        ),
        Expanded(child: mainContent)
      ],
    );
  }
  _onValueChanged(String value){
    setState(() {
      if(value.isEmpty){
        visibleUsers = widget.user;
      }
      else{
        visibleUsers = new List<User>();
        for(User user in widget.user){
          if(user.firstName.contains(value) || user.lastName.contains(value)) {
            visibleUsers.add(user);
          }
        }
      }
    });

  }
}


class UserListTile extends StatelessWidget{
  final User user;
  final Function(BuildContext context, User user) onTap;
  final Function(User user) onSwipe;

  const UserListTile({Key key, @required this.user, this.onTap, this.onSwipe}): super(key: key);

  @override
  Widget build(BuildContext context) {
    String permission = UserPermissionLevelConverter.convertPermissionToString(user.permissionLevel);
    return Slidable(
      actionPane: SlidableDrawerActionPane(),
      actionExtentRatio: 0.25,
      child: ListTile(
          onTap: () => onTap(context, user),
          title: Text(user.firstName + " "+user.lastName),
          subtitle: Text(permission +  (user.house == null? "" : " - " +user.house))
      ),
    );
  }

}
