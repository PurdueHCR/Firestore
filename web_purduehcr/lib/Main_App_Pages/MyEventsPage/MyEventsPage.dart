import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Main_App_Pages/MyEventsPage/EventCreationForm.dart';
import 'package:purduehcr_web/Main_App_Pages/MyEventsPage/my_events_bloc/my_events.dart';
import 'package:purduehcr_web/Models/Event.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/FunctionUtilities.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/EventList.dart';

class MyEventsPage extends BasePage {
  MyEventsPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _MyEventsPageState("My Events");
  }
}

class _MyEventsPageState
    extends BasePageState<MyEventsBloc, MyEventsEvent, MyEventsState> {
  _MyEventsPageState(String drawerLabel) : super(drawerLabel);

  MyEventsBloc _myEventsBloc;
  Event _selectedEvent;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_myEventsBloc == null) {
      Config config = ConfigWrapper.of(context);
      _myEventsBloc = new MyEventsBloc(config: config);
      _myEventsBloc.add(MyEventsInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, MyEventsState state}) {
    _handleSnackChatState(context, state);
    if (state is MyEventsPageInitializeError) {
      return Center(child: Text("There was an error loading the rewards."));
    } else {
      return Row(
        children: [
          Flexible(
            child: EventList(
              events: state.myEvents,
              onPressed: (context, event) {
                setState(() {
                  _selectedEvent = event;
                });
              },
            ),
          ),
          Flexible(
              child: SingleChildScrollView(
                child: BlocProvider(
                    builder: (BuildContext context) => _myEventsBloc,
                    child: Text('Uncomment edit event form')
                  // EditEventForm(
                  //   key: ObjectKey(_selectedEvent),
                  //   reward: _selectedEvent,
                  // ),
                ),
              )
          )
        ],
      );
    }
  }
  @override
  Widget buildSmallDesktopBody({BuildContext context, MyEventsState state}) {
    return _buildSmallBody(context, state);
  }

  @override
  Widget buildMobileBody({BuildContext context, MyEventsState state}) {
    return _buildSmallBody(context, state);
  }

  Widget _buildSmallBody(BuildContext context, MyEventsState state) {
    _handleSnackChatState(context, state);
    if (state is MyEventsPageInitializeError) {
      return Center(child: Text("There was an error loading you events."));
    } else {
      if (_selectedEvent == null) {
        return EventList(
          events: state.myEvents,
          onPressed: (context, event) {
            setState(() {
              _selectedEvent = event;
            });
          },
        );
      } else {
        return SingleChildScrollView(
          child: BlocProvider(
            builder: (BuildContext context) => _myEventsBloc,
            child: Text('Uncomment edit event form')
            // EditEventForm(
            //   key: ObjectKey(_selectedEvent),
            //   reward: _selectedEvent,
            // ),
          ),
        );
      }
    }
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context) {
    return FloatingActionButton(
      child: Icon(Icons.add),
      onPressed: () => _createEventButton(context),
    );
  }

  _createEventButton(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return SimpleDialog(
            title: Text("Create New Event"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))),
            children: [
              SizedBox(
                  width: getOptimalDialogWidth(context),
                  child: BlocProvider(
                      builder: (BuildContext context) => _myEventsBloc,
                      child: EventCreationForm()
                  )
              )
            ],
          );
        });
  }

  @override
  MyEventsBloc getBloc() {
    return _myEventsBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is MyEventsPageLoading;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet.getActivityPlanners();
  }

  _handleSnackChatState(BuildContext context, MyEventsState state) {
    if (state is EventCreationSuccess) {
      FunctionUtilities.showSnackBar(context, Colors.green, 'The event has been created!', _myEventsBloc, EventHandledMessage(), popContext: true);
    }
    else if (state is MyEventsPageCreateEventError) {
      FunctionUtilities.showSnackBar(context, Colors.red, 'There was an error creating the event. Please try again.', _myEventsBloc, EventHandledMessage(), popContext: true);
    }
    // else if (state is UpdateEventError) {
    //   FunctionUtilities.showSnackBar(context, Colors.red, 'There was an error updating the event. Please try again.', _myEventsBloc, EventHandleMessage());
    // }
    // else if (state is DeleteEventSuccess) {
    //   FunctionUtilities.showSnackBar(context, Colors.green, 'The event was successfully deleted', _myEventsBloc, EventHandleMessage(), popContext: true);
    //   WidgetsBinding.instance.addPostFrameCallback((_) {
    //     _selectedEvent = null;
    //   });
    // }
    // else if (state is DeleteEventError) {
    //   FunctionUtilities.showSnackBar(context, Colors.red, 'There was an error deleting the event. Please try again.', _myEventsBloc, EventHandleMessage(), popContext: true);
    // }
  }

  @override
  Widget buildLeadingButton(DisplayType displayType) {
    if (_selectedEvent == null || displayType == DisplayType.desktop_large) {
      return null;
    } else {
      return IconButton(
        icon: Icon(Icons.arrow_back),
        onPressed: () {
          setState(() {
            _selectedEvent = null;
          });
        },
      );
    }
  }

  @override
  void dispose() {
    super.dispose();
    _myEventsBloc.close();
  }
}
