import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/PointTypesPage/PointTypeEditForm.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/PointTypesPage/point_type_control_bloc/point_type_control.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

import 'PointTypeCreationForm.dart';

class PointTypesControlPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _PointTypesControlPageState( "Point Categories");
  }
}

class _PointTypesControlPageState extends BasePageState<PointTypeControlBloc, PointTypeControlEvent, PointTypeControlState>{
  _PointTypesControlPageState(String drawerLabel) : super(drawerLabel);

  PointTypeControlBloc _pointTypeControlBloc;
  PointType _selectedPointType;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_pointTypeControlBloc == null) {
      Config config = ConfigWrapper.of(context);
      _pointTypeControlBloc = new PointTypeControlBloc(config: config);
      _pointTypeControlBloc.add(PointTypeControlInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, PointTypeControlState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: PointTypeList(
              pointTypes: state.pointTypes,
              onPressed: (BuildContext context, PointType type){
                setState(() {
                  _selectedPointType = type;
                });
              }
          ),
        ),
        VerticalDivider(),
        Flexible(
            child: SingleChildScrollView(
              child: BlocProvider(
                builder: (BuildContext context) => _pointTypeControlBloc,
                child: PointTypeEditForm(
                    key: ObjectKey(_selectedPointType),
                    pointType: _selectedPointType
                ),
              ),
            )
        )
      ],
    );
  }

  @override
  Widget buildMobileBody({BuildContext context, PointTypeControlState state}) {
    _onChangeState(context, state);
    if(_selectedPointType == null){
      return PointTypeList(
          pointTypes: state.pointTypes,
          onPressed: (BuildContext context, PointType type){
            setState(() {
              _selectedPointType = type;
            });
          }
      );
    }
    else {
      return SingleChildScrollView(
        child: BlocProvider(
          builder: (BuildContext context) => _pointTypeControlBloc,
          child: PointTypeEditForm(
              key: ObjectKey(_selectedPointType),
              pointType: _selectedPointType
          ),
        ),
      );
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, PointTypeControlState state}) {
    _onChangeState(context, state);
    if(_selectedPointType == null){
      return PointTypeList(
          pointTypes: state.pointTypes,
          onPressed: (BuildContext context, PointType type){
            setState(() {
              _selectedPointType = type;
            });
          }
      );
    }
    else {
      return SingleChildScrollView(
        child: BlocProvider(
          builder: (BuildContext context) => _pointTypeControlBloc,
          child: PointTypeEditForm(
              key: ObjectKey(_selectedPointType),
              pointType: _selectedPointType
          ),
        ),
      );
    }
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

  @override
  PointTypeControlBloc getBloc() {
    return _pointTypeControlBloc;
  }

  @override
  bool isLoadingState(PointTypeControlState currentState) {
    return currentState is PointTypeControlPageLoading;
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context){
    return FloatingActionButton(
      child: Icon(Icons.add),
      onPressed: () => _createPointTypeButton(context),
    );
  }

  _createPointTypeButton(BuildContext context){
    showDialog(
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Create New Point Category"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))
            ),
            children: [
              SizedBox(
                  width: getOptimalDialogWidth(context),
                  child: BlocProvider(
                    builder: (BuildContext context) => _pointTypeControlBloc,
                    child: PointTypeCreationForm()
                  )
              )
            ],
          );
        }
    );
  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedPointType == null || displayType == DisplayType.desktop_large){
      return null;
    }
    else{
      return IconButton(icon: Icon(Icons.arrow_back),
        onPressed: (){
          setState(() {
            _selectedPointType = null;
          });
        },);
    }
  }


  _onChangeState(BuildContext context, PointTypeControlState state){
    if(state is UpdatePointTypeError){
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text("Sorry. There was an error updating your Point Category. Please try again."),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _pointTypeControlBloc.add(PointTypeControlDisplayMessage());
      });
    }
    else if(state is CreatePointTypeSuccess){
      Navigator.pop(context);
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text("The Point Category has been created!"),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _pointTypeControlBloc.add(PointTypeControlDisplayMessage());
      });
    }
    else if(state is CreatePointTypeError){
      Navigator.pop(context);
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text("Sorry. There was an error creating your Point Category. Please try again."),
      );
      WidgetsBinding.instance
          .addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _pointTypeControlBloc.add(PointTypeControlDisplayMessage());
      });
    }
  }

  @override
  void dispose() {
    _pointTypeControlBloc.close();
    super.dispose();
  }
}