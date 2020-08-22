import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Main_App_Pages/FindUsersPage/EditUserForm.dart';
import 'package:purduehcr_web/Main_App_Pages/FindUsersPage/find_users_bloc/find_users.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/UserList.dart';

class FindUsersPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    return _FindUsersPageState("Find Users");
  }
}


class _FindUsersPageState extends BasePageState<FindUsersBloc, FindUsersEvent, FindUsersState>{
  FindUsersBloc _findUsersBloc;
  String term = "";
  TextEditingController searchController = new TextEditingController();
  User _selectedUser;

  _FindUsersPageState(String drawerLabel) : super(drawerLabel);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_findUsersBloc == null) {
      Config config = ConfigWrapper.of(context);
      _findUsersBloc = new FindUsersBloc(config: config);
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, FindUsersState state}) {
    _handleSnackChatState(context,state);
    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        buildSearchView(context,state),
        buildLargeBottomView(context, state)
      ],
    );
  }

  @override
  Widget buildMobileBody({BuildContext context, FindUsersState state}) {
    _handleSnackChatState(context,state);
    if(_selectedUser == null){
      return Column(
        children: [
          buildSearchView(context,state),
          buildSmallBottomView(context, state)
        ],
      );
    }
    else{
      return BlocProvider(
        builder: (BuildContext context) => _findUsersBloc,
        child: EditUserForm(key: ObjectKey(_selectedUser),user: _selectedUser,),
      );
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, FindUsersState state}) {
    _handleSnackChatState(context,state);
    if(_selectedUser == null){
      return Column(
        children: [
          buildSearchView(context,state),
          buildSmallBottomView(context, state)
        ],
      );;
    }
    else{
      return BlocProvider(
        builder: (BuildContext context) => _findUsersBloc,
        child: EditUserForm(key: ObjectKey(_selectedUser),user: _selectedUser,),
      );
    }

  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

  @override
  FindUsersBloc getBloc() {
    return _findUsersBloc;
  }

  @override
  bool isLoadingState(FindUsersState currentState) {
    return currentState is FindUsersPageLoading;
  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedUser == null || displayType == DisplayType.desktop_large){
      return null;
    }
    else{
      return IconButton(icon: Icon(Icons.arrow_back),
        onPressed: (){
          setState(() {
            _selectedUser = null;
          });
        },);
    }
  }

  @override
  void dispose() {
    super.dispose();
    _findUsersBloc.close();
  }

  List<Widget> buildLetterButtons(BuildContext context){
    List<Widget> buttons = [];
    for (String i in "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')) {
      buttons.add(
          (term == i)?
          RaisedButton(
            child: Text(i),
          )
              :
          FlatButton(
            child: Text(i),
            onPressed: () {
              term = i;
              _findUsersBloc.add(FindUsers(i));
            },
          )
      );
    }
    return buttons;
  }

  Widget buildSearchView(BuildContext context, FindUsersState state){
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 0, 0),
          child: Text(
            "Search By Last Name",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.black,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              mainAxisSize: MainAxisSize.max,
              children: [
                Flexible(
                  flex: 3,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                    child: TextField(
                      controller: searchController,
                      decoration: InputDecoration(
                        hintText: "Last Name of User",
                        border: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                Flexible(
                  flex: 1,
                  child: FlatButton(
                    child: Icon(Icons.search),
                    onPressed: () {
                      term = searchController.text;
                      _findUsersBloc.add(FindUsers(searchController.text));
                    },
                  ),
                )
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 0, 0),
          child: Text(
            "Search By Last Initial",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 0, 0),
          child: Wrap(
            alignment: WrapAlignment.center,
            children: buildLetterButtons(context),
          ),
        )
      ],
    );
  }
  Widget buildLargeBottomView(BuildContext context, FindUsersState state) {
    if (state is FindUsersLoading) {
      return Expanded(
        child: LoadingWidget(),
      );
    }
    else if (state is FindUsersLoaded) {
      return Expanded(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          child:
          Row(
            children: [
              Expanded(
                child: UserList(
                  user: state.users,
                  searchable: false,
                  showLoadMoreButton: state.users.length % 25 == 0, //Pages are 25, so if length is not divisible by 25, then there are no more to load
                  loadMore: loadMore,
                  onPressed: (_ , User user) {
                    setState(() {
                      _selectedUser = user;
                    });
                  },
                ),
              ),
              Expanded(
                child: BlocProvider(
                  builder: (BuildContext context) => _findUsersBloc,
                  child: EditUserForm(key: ObjectKey(_selectedUser),user: _selectedUser,),
                ),
              )
            ],
          ),
        ),
      );
    }
    else {
      return Expanded(
        child: Center(child: Text("Enter a last name or select a letter to search for.")),
      );
    }
  }
  Widget buildSmallBottomView(BuildContext context, FindUsersState state) {
    if (state is FindUsersLoading) {
      return Expanded(
        child: LoadingWidget(),
      );
    }
    else if (state.users != null) {
      return Expanded(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          child:
          UserList(
            user: state.users,
            searchable: false,
            showLoadMoreButton: state.users.length % 25 == 0, //Pages are 25, so if length is not divisible by 25, then there are no more to load
            loadMore: loadMore,
            onPressed: (_ , User user) {
              setState(() {
                _selectedUser = user;
              });
            },
          ),
        ),
      );
    }
    else {
      return Expanded(
        child: Center(child: Text("Enter a last name or select a letter to search for.")),
      );
    }
  }

  loadMore(){
    FindUsersState state = _findUsersBloc.state;
    if(state is FindUsersLoaded){
      _findUsersBloc.add(FindUsers(term, previousName: state.users[24].lastName));
    }
  }

  _handleSnackChatState(BuildContext context, FindUsersState state){
    if(state is UpdateUserError){
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text(
            'There was an error updating the user. Please try again.'),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _findUsersBloc.add(HandleMessage());
      });
    }
  }

}