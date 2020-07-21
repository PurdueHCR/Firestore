
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/LinkPage/LinkCreationForm.dart';
import 'package:purduehcr_web/LinkPage/LinkEditForm.dart';
import 'package:purduehcr_web/LinkPage/link_bloc/link.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LinkList.dart';

import '../Config.dart';

class LinkPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _LinkPageState( "Links");
  }

}

class _LinkPageState extends BasePageState<LinkBloc, LinkEvent, LinkState>{

  LinkBloc _linkBloc;
  Link _selectedLink;

  _LinkPageState(String drawerLabel) : super(drawerLabel);


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_linkBloc == null) {
      Config config = ConfigWrapper.of(context);
      _linkBloc = new LinkBloc(config: config);
      _linkBloc.add(LinkInitialize());
    }
}

  @override
  Widget buildMobileBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    if(_selectedLink == null){
      return LinkList(
          links: _linkBloc.state.links,
          onPressed: _onPressed
      );
    }
    else {
      return BlocProvider(
        builder: (BuildContext context) => _linkBloc,
        child: LinkEditForm(
            key: ObjectKey(_selectedLink),
            link: _selectedLink,
            onUpdate: _onUpdate
        ),
      );
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: LinkList(
              links: _linkBloc.state.links,
              onPressed: (BuildContext context, Link link){
                setState(() {
                  _selectedLink = link;
                });
              }
          ),
        ),
        VerticalDivider(),
        Flexible(
          child: BlocProvider(
            builder: (BuildContext context) => _linkBloc,
            child: LinkEditForm(
                key: ObjectKey(_selectedLink),
                link: _selectedLink,
                onUpdate: _onUpdate
            ),
          )
        )
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    if(_selectedLink == null){
      return LinkList(
          links: _linkBloc.state.links,
          onPressed: _onPressed
      );
    }
    else {
      return BlocProvider(
        builder: (BuildContext context) => _linkBloc,
        child: LinkEditForm(
            key: ObjectKey(_selectedLink),
            link: _selectedLink,
            onUpdate: _onUpdate
        ),
      );
    }
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
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))
            ),
            children: [
              SizedBox(
                width: getOptimalDialogWidth(context),
                child: LinkCreationForm(_linkBloc, _onCreate)
              )
            ],
          );
        }
    );
  }

  _onCreate(String description,bool enabled, bool singleUse, int pointTypeId){
    _linkBloc.add(CreateLink(
        description: description,
        enabled: enabled,
        singleUse: singleUse,
        pointTypeId: pointTypeId,
        shouldDismissDialog: true));
  }

  _onUpdate(Link link){
    _linkBloc.add(UpdateLink(link: link));

  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedLink == null || displayType == DisplayType.desktop_large){
      return null;
    }
    else{
      return IconButton(icon: Icon(Icons.arrow_back),
        onPressed: (){
          setState(() {
            _selectedLink = null;
          });
        },);
    }
  }

  _onPressed(BuildContext context, Link link){
    setState(() {
      _selectedLink = link;
    });
  }


  _onChangeState(BuildContext context, LinkState state){
    if(state is CreateLinkSuccess){
      Navigator.pop(context);
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text("Your link has been created!"),
      );
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _linkBloc.add(LinkDisplayedMessage());
      });
    }
    else if(state is CreateLinkError){
      Navigator.pop(context);
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text("Sorry. There was a problem creating your link. Please try again."),
      );
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _linkBloc.add(LinkDisplayedMessage());
      });
    }
    else if(state is UpdateLinkError){
      print("Failed to update link");
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text("Sorry, there was an error updating your link. Please try again."),
      );

      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _selectedLink = state.originalLink;
        _linkBloc.add(LinkDisplayedMessage());
      });
    }
    else if(state is UpdateLinkSuccess){
      Future.delayed(Duration(seconds: 1), (){
        // Handle a link update success
        if(state.description != null)
          state.originalLink.description = state.description;
        if(state.enabled != null)
          state.originalLink.enabled = state.enabled;
        if(state.singleUse != null)
          state.originalLink.singleUse = state.singleUse;
        if(state.archived != null)
          state.originalLink.archived = state.archived;
        _linkBloc.add(LinkDisplayedMessage());
      });

    }
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return ActivityPlannerSet();
  }

}