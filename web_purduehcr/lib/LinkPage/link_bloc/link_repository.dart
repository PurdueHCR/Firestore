import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class LinkRepository {

  final Config config;

  LinkRepository(this.config);

  Future<List<PointType>> getPointTypes() async {
    Map<String,dynamic> pointTypeList = await callCloudFunction(config, Method.GET, "point_type/linkable");
    Set<Map<String, dynamic>> pointTypes = Set.from(pointTypeList["point_types"]);
    List<PointType> pts = new List();
    pointTypes.forEach((element) {
      pts.add(PointType.fromJson(element));
    });
    return pts;
  }

  Future<List<Link>> getLinks() async {
    Map<String,dynamic> linkQuerySnapshot = await callCloudFunction(config, Method.GET, "user/links");
    Set<Map<String, dynamic>> linkSnapshot = Set.from(linkQuerySnapshot["links"]);
    List<Link> links = new List();
    linkSnapshot.forEach((element) {
      links.add(Link.fromJson(element));
    });
    return links;
  }

  Future<Link> createLink(String description, bool enabled, bool singleUse, int pointTypeId) async {
    Map<String, dynamic> body = {"description": description, "single_use":singleUse, "is_enabled":enabled, "point_id":pointTypeId};
    Map<String, dynamic> linkDocument = await callCloudFunction(config, Method.POST, "link/create", body: body);
    return Link.fromJson(linkDocument);
  }

  Future updateLink(Link link, {String description, bool enabled, bool singleUse, bool archived}) async {
    Map<String, dynamic> body = Map();
    body["link_id"] = link.id;
    body[Link.DESCRIPTION] = (description != null)? description : link.description;
    body[Link.ENABLED] = (enabled != null)? enabled : link.enabled;
    body[Link.ARCHIVED] = (archived != null)? archived : link.archived;
    body[Link.SINGLE_USE] = (singleUse != null)? singleUse : link.singleUse;
    await callCloudFunction(config, Method.PUT, "link/update", body: body);
  }
  
}