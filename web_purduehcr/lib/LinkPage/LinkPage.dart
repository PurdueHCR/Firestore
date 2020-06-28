import 'dart:html';

import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/LinkPage/link_bloc/link.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LinkList.dart';

import '../Config.dart';

class LinkPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _LinkPageState(drawerLabel: "Links");
  }

}

class _LinkPageState extends BasePageState<LinkBloc, LinkEvent, LinkState>{

  LinkBloc _linkBloc;
  Link _selectedLink;

  _LinkPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  void initState() {
    super.initState();
    Config config = ConfigWrapper.of(context);
    _linkBloc = new LinkBloc(config: config);
    _linkBloc.add(LinkInitialize());
  }

  @override
  Widget buildMobileBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return LinkList(
        links: _linkBloc.state.links,
        onPressed: _onPressed
    );
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: LinkList(
              links: _linkBloc.state.links,
              onPressed: _onPressed
          ),
        ),
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return LinkList(
        links: _linkBloc.state.links,
        onPressed: _onPressed
    );
  }

  @override
  LinkBloc getBloc() {
    return _linkBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is LinkLoading;
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context){
    return FloatingActionButton(
      child: Icon(Icons.add),
      onPressed: () => _createLinkButton(context),
    );
  }

  _createLinkButton(BuildContext context){
    showDialog(
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Create New Link"),
            children: [
              Text("Link Creation form that is unimplemented")
            ],
          );
        }
    );
  }

  _onPressed(BuildContext context, Link link){
    if(displayTypeOf(context) == DisplayType.desktop_large){
      setState(() {
        _selectedLink = link;
      });
    }
    else{
      showDialog(
          context: context,
          builder: (BuildContext context){
            return SimpleDialog(
              title: Text("Link Details"),
              children: [
                Text("Link Details form that is unimplemented")
              ],
            );
          }
      );
    }
  }


  _onChangeState(BuildContext context, LinkState state){
//    if(state is SubmissionSuccess){
//      window.console.log("On change state success");
//      if(state.shouldDismissDialog){
//        Navigator.pop(context);
//      }
//      final snackBar = SnackBar(
//        backgroundColor: Colors.green,
//        content: Text('Submission Recorded'),
//      );
//      Scaffold.of(context).showSnackBar(snackBar);
//      _linkBloc.add(LinkDisplayedMessage());
//      _selectedPointType = null;
//    }
//    else if(state is SubmissionError){
//      window.console.log("On change state error");
//      if(state.shouldDismissDialog){
//        Navigator.pop(context);
//      }
//      final snackBar = SnackBar(
//        backgroundColor: Colors.red,
//        content: Text('Could not record submission'),
//      );
//      Scaffold.of(context).showSnackBar(snackBar);
//      _linkBloc.add(LinkDisplayedMessage());
//      _selectedPointType = null;
//
//    }
  }

}