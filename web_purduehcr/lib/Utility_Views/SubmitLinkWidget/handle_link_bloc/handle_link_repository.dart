import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class HandleLinkRepository {

  final Config config;

  HandleLinkRepository(this.config);

  Future<Link> getLink(String linkId) async {
    Map<String,dynamic> link = await callCloudFunction(config, Method.GET, "link/", params: {"id":linkId});
    return Link.fromJson(link);
  }

  Future submitLink(String linkId) async {
    Map<String, dynamic> body = {"link_id": linkId};
    await callCloudFunction(config, Method.POST, "user/submitLink", body: body);
  }

}