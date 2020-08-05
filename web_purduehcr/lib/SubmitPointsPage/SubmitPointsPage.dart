
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/SubmitPointsPage/PointSubmissionForm.dart';
import 'package:purduehcr_web/SubmitPointsPage/submit_points_bloc/submit_points.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

import '../Config.dart';

class SubmitPointsPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _SubmitPointsPageState("Submit Points");
  }

}

class _SubmitPointsPageState extends BasePageState<SubmitPointBloc, SubmitPointEvent, SubmitPointState>{

  SubmitPointBloc _submitPointBloc;
  PointType _selectedPointType;

  _SubmitPointsPageState(String drawerLabel) : super(drawerLabel);





  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_submitPointBloc == null){
      Config config = ConfigWrapper.of(context);
      _submitPointBloc = new SubmitPointBloc(config);
      _submitPointBloc.add(SubmitPointInitialize());
    }
  }

  @override
  Widget buildMobileBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    if(_selectedPointType == null){
      return PointTypeList(
          pointTypes: _submitPointBloc.state.pointTypes,
          onPressed: _onPressed
      );
    }
    else{
      return PointSubmissionForm(
        key: new ObjectKey(_selectedPointType),
        pointType: _selectedPointType,
        onSubmit: _onSubmit,
      );
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: Container(
            color: Colors.grey,
            child: PointTypeList(
                pointTypes: _submitPointBloc.state.pointTypes,
                onPressed: _onPressed
            ),
          ),
        ),
        Flexible(
            child: PointSubmissionForm(
              key: new ObjectKey(_selectedPointType),
              pointType: _selectedPointType,
              onSubmit: _onSubmit,
            )
        )
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    if(_selectedPointType == null){
      return PointTypeList(
          pointTypes: _submitPointBloc.state.pointTypes,
          onPressed: _onPressed
      );
    }
    else{
      return PointSubmissionForm(
        key: new ObjectKey(_selectedPointType),
        pointType: _selectedPointType,
        onSubmit: _onSubmit,
      );
    }
  }

  @override
  SubmitPointBloc getBloc() {
    return _submitPointBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is SubmitPointPageLoading;
  }

  _onPressed(BuildContext context, PointType pointType){
    setState(() {
      _selectedPointType = pointType;
    });
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

  _onSubmit(String description,DateTime dateOccurred,int pointTypeId) async {
    print("Submit Point: $description, ${dateOccurred.toString()}, ${pointTypeId.toString()}");
    _submitPointBloc.add(SubmitPoint(
        description: description,
        dateOccurred: dateOccurred,
        pointTypeId: pointTypeId,
        shouldDismissDialog: displayTypeOf(context) != DisplayType.desktop_large));
  }

  _onChangeState(BuildContext context, SubmitPointState state){
    if(state is SubmissionSuccess){
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text('Submission Recorded'),
      );

      //This is not a good way to do this, but if you can find a better way to do this
      // and running in debug doesn't throw an error, please change it
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _selectedPointType = null;
        _submitPointBloc.add(SubmitPointDisplayedMessage());
      });
    }
    else if(state is SubmissionError){
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text('Could not record submission'),
      );

      //This is not a good way to do this, but if you can find a better way to do this
      // and running in debug doesn't throw an error, please change it
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _submitPointBloc.add(SubmitPointDisplayedMessage());
        _selectedPointType = null;
      });

    }
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return CompetitionParticipantsSet();
  }

}