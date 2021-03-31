import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Main_App_Pages/HistoryPage/history_bloc/history.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/LogListAndChat.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

class HistoryPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    return _HistoryPageState( "House History");
  }
}

class _HistoryPageState
    extends BasePageState<HistoryBloc, HistoryEvent, HistoryState> {
  HistoryBloc _historyBloc;
  DateTime _selectedDate;
  PointType _selectedPointType;
  PointLog _selectedPointLog;
  TextEditingController recentController = TextEditingController();
  TextEditingController userController = TextEditingController();
  TextEditingController pointTypeController = TextEditingController();

  _HistoryPageState(String drawerLabel) : super(drawerLabel);

  bool searchError = false;
  bool isDisplayingLoadingSymbol = false;


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_historyBloc == null) {
      Config config = ConfigWrapper.of(context);
      _historyBloc = new HistoryBloc(config: config);
      if(authState.user.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF){
        _historyBloc.add(SelectHouse(house: authState.preferences.houseIds[0]));
      }
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, HistoryState state}) {
    _onChangeState(context,state);
    if(state is HistoryPageError){
      return Column(
        children: [
          buildSearchView(context, state),
          Center(
            child: Text("There was a problem loading the residents. Please try again."),
          )
        ],
      );
    }
    else{
      return Column(
        children: [
          buildSearchView(context, state),
          buildBottomView(context, state)
        ],
      );
    }

  }

  @override
  Widget buildMobileBody({BuildContext context, HistoryState state}) {
    _onChangeState(context,state);
    if(state is HistoryPageError){
      return Column(
        children: [
          buildSearchView(context, state),
          Center(
            child: Text("There was a problem loading the residents. Please try again."),
          )
        ],
      );
    }
    else{
      if(_selectedPointLog == null){
        return Column(
          children: [
            buildSearchView(context, state),
            buildBottomView(context, state)
          ],
        );
      }
      else{
        return Column(
          children: [
            buildBottomView(context, state)
          ],
        );
      }
    }

  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, HistoryState state}) {
    _onChangeState(context,state);
    if(state is HistoryPageError){
      return Column(
        children: [
          buildSearchView(context, state),
          Center(
            child: Text("There was a problem loading the residents. Please try again."),
          )
        ],
      );
    }
    else{
      if(_selectedPointLog == null){
        return Column(
          children: [
            buildSearchView(context, state),
            buildBottomView(context, state)
          ],
        );
      }
      else{
        return Column(
          children: [
            buildBottomView(context, state)
          ],
        );
      }
    }

  }

  Widget buildBottomView(BuildContext context, HistoryState state) {
      if (state.logs != null) {
      return Expanded(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          child: LogListAndChat(
              key: ObjectKey(state.logs),
              logs: state.logs,
              onPressed: _onPressed,
              selectedPointLog: _selectedPointLog,
              searchable: false,
              house: state.house,
              showLoadMore: state.logs.length % 25 == 0, //Pages are 25, so if length is not divisible by 25, then there are no more to load
              loadMore: loadMore,
          ),
        ),
      );
    }
    else {
      return Expanded(
        child: Center(
          child: Text("Enter your search criteria and hit the search button!"),
        ),
      );
    }
  }

  loadMore(){
    startLoadingSpinner();
    _historyBloc.add(SearchNext());
  }

  startLoadingSpinner(){
    showDialog(
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))
            ),
            children: [
              LoadingWidget()
            ],
          );
        }
    );
    //Don't call set state because we don't want it to reload the page
    isDisplayingLoadingSymbol = true;
  }

  Widget buildSearchView(BuildContext context, HistoryState state) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 0, 0),
          child: Text(
            "Search Category",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          child: (displayTypeOf(context) == DisplayType.desktop_large)
              ? Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              (state.searchType == "recent")
                  ? RaisedButton(
                child: Text("Recent Submissions"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "recent"));
                },
              )
                  : OutlineButton(
                child: Text("Recent Submissions"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "recent"));
                },
              ),
              (state.searchType == "user")
                  ? RaisedButton(
                child: Text("Resident Name"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "user"));
                },
              )
                  : OutlineButton(
                child: Text("Resident Name"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "user"));
                },
              ),
              (state.searchType == "point_type")
                  ? RaisedButton(
                child: Text("Point Category"),
                onPressed: () {
                  _historyBloc.add(
                      SelectSearchType(searchType: "point_type"));
                },
              )
                  : OutlineButton(
                child: Text("Point Category"),
                onPressed: () {
                  _historyBloc.add(
                      SelectSearchType(searchType: "point_type"));
                },
              )
            ],
          )
              : Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              (state.searchType == "recent")
                  ? RaisedButton(
                child: Text("Recent Submissions"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "recent"));
                },
              )
                  : OutlineButton(
                child: Text("Recent Submissions"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "recent"));
                },
              ),
              (state.searchType == "user")
                  ? RaisedButton(
                child: Text("Resident Name"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "user"));
                },
              )
                  : OutlineButton(
                child: Text("Resident Name"),
                onPressed: () {
                  _historyBloc
                      .add(SelectSearchType(searchType: "user"));
                },
              ),
              (state.searchType == "point_type")
                  ? RaisedButton(
                child: Text("Point Category"),
                onPressed: () {
                  _historyBloc.add(
                      SelectSearchType(searchType: "point_type"));
                },
              )
                  : OutlineButton(
                child: Text("Point Category"),
                onPressed: () {
                  _historyBloc.add(
                      SelectSearchType(searchType: "point_type"));
                },
              )
            ],
          ),
        ),
        generateHouseButtons(context,state),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.grey[500],
              ),
              borderRadius: BorderRadius.all(Radius.circular(5)),
              color: Colors.grey[300],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              mainAxisSize: MainAxisSize.max,
              children: [
                Flexible(
                  flex: 3,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                    child: (state.searchType == "recent")
                        ? TextField(
                      controller: recentController,
                      decoration: InputDecoration(
                        hintText: "Select an upper bound date",
                        border: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                      ),
                      onChanged: (val) {
                        setState(() {
                          if (_selectedDate == null) {
                            recentController.text = "";
                            searchError = false;
                          }
                          else {
                            recentController.text =
                                DateFormat.yMd('en_US').format(_selectedDate);
                            searchError = false;
                          }
                        });
                      },
                      onTap: () async {
                        DateTime now = DateTime.now();
                        DateTime start;
                        if (now.month >= 8) {
                          start = DateTime(now.year, 8);
                        }
                        else {
                          start = DateTime(now.year, 0);
                        }
                        DateTime date = await showDatePicker(context: context,
                            initialDate: now,
                            firstDate: start,
                            lastDate: now);
                        FocusScope.of(context).unfocus();
                        setState(() {
                          _selectedDate = date;
                          recentController.text =
                              DateFormat.yMd('en_US').format(_selectedDate);
                        });
                      },
                    )
                        : (state.searchType == "user")
                        ? TextField(
                      controller: userController,
                      decoration: InputDecoration(
                        hintText: "Enter the user's last name",
                        border: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                          fillColor: (searchError)? Colors.red : Colors.grey,
                          filled: searchError
                      ),

                      onChanged: (text){
                        setState(() {
                          searchError = false;
                        });
                      },
                    )
                        : TextField(
                      controller: pointTypeController,
                      decoration: InputDecoration(
                        hintText: "Select point category",
                        border: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                        fillColor: (searchError)? Colors.red : Colors.grey,
                        filled: searchError
                      ),
                      onChanged: (val) {
                        setState(() {
                          if (_selectedPointType == null) {
                            pointTypeController.text = "";
                            searchError = false;
                          }
                          else {
                            pointTypeController.text = _selectedPointType.name;
                            searchError = false;
                          }
                        });
                      },
                      onTap: () async {
                        PointType pt = await showDialog<PointType>(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text("Choose Point Type"),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.all(
                                        Radius.circular(10.0))
                                ),
                                content: SingleChildScrollView(
                                  child: SizedBox(
                                    width: 500,
                                    height: 400,
                                    child: FutureBuilder(
                                        future: _historyBloc.getPointTypes,
                                        builder: (context, snapshot) {
                                          if (snapshot.connectionState ==
                                              ConnectionState.done) {
                                            return PointTypeList(
                                                pointTypes: snapshot
                                                    .data as List<PointType>,
                                                onPressed: (
                                                    BuildContext context,
                                                    PointType pt) {
                                                  Navigator.pop(context, pt);
                                                });
                                          }
                                          else {
                                            return LoadingWidget();
                                          }
                                        }
                                    ),
                                  ),
                                ),
                              );
                            }
                        );
                        setState(() {
                          if(pt != null){
                            _selectedPointType = pt;
                            FocusScope.of(context).unfocus();
                            pointTypeController.text = _selectedPointType.name;
                            searchError = false;
                          }
                        });
                      },
                    ),
                  ),
                ),
                Flexible(
                  flex: 1,
                  child: FlatButton(
                    child: Icon(Icons.search),
                    onPressed: () {
                      startLoadingSpinner();
                      if (state.searchType == "recent") {
                        _historyBloc.add(SearchRecent(date: _selectedDate));
                      }
                      else if (state.searchType == "user") {
                        if(userController.text.isNotEmpty){
                          _historyBloc.add(SearchUser(userLastName: userController.text));
                        }
                        else{
                          setState(() {
                            searchError = true;
                          });
                        }
                      }
                      else {
                        if(_selectedPointType != null){
                          _historyBloc.add(
                              SearchPointType(pointType: _selectedPointType));
                        }
                        else{
                          setState(() {
                            searchError = true;
                          });
                        }
                      }
                    },
                  ),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  getBloc() {
    return _historyBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is HistoryPageLoading;
  }

  @override
  void dispose() {
    super.dispose();
    _historyBloc.close();
  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedPointLog == null || displayType == DisplayType.desktop_large){
      return null;
    }
    else{
      return IconButton(icon: Icon(Icons.arrow_back),
        onPressed: (){
          setState(() {
            _selectedPointLog = null;
          });
        },);
    }
  }

  _onPressed(BuildContext context, PointLog pointLog) {
    setState(() {
      _selectedPointLog = pointLog;
    });
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return ResidentialLifeStaffSet();
  }

  Widget generateHouseButtons(BuildContext context, HistoryState state){
    if(authState.user.permissionLevel == UserPermissionLevel.PROFESSIONAL_STAFF){
      List<Widget> buttons = [];
      for(String house in authState.preferences.houseIds){
        if(house == state.house){
          buttons.add(RaisedButton(
            child: Text(house),
            onPressed: (){
              setState(() {
                _historyBloc.add(SelectHouse(house:house));
              });
            },
          ));
        }
        else{
          buttons.add(OutlineButton(
            child: Text(house),
            onPressed: (){
              setState(() {
                _historyBloc.add(SelectHouse(house:house));
              });
            },
          ));
        }
      }
      return Center(
        child: Wrap(
          alignment: WrapAlignment.center,
          children: buttons,
        ),
      );
    }
    else{
      return SizedBox.shrink();
    }
  }

  _onChangeState(BuildContext context, HistoryState state){
    if(state is HistoryPageLoaded && isDisplayingLoadingSymbol){
      isDisplayingLoadingSymbol = false;
      Navigator.pop(context);
    }
  }
}
