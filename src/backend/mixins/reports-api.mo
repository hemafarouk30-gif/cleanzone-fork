import Common "../types/common";
import ReportTypes "../types/reports";
import UserTypes "../types/users";
import ReportLib "../lib/reports";
import UserLib "../lib/users";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  reports : List.List<ReportTypes.Report>,
  reportIdCounter : List.List<Nat>,
  users : List.List<UserTypes.UserProfile>,
  adminPrincipal : Common.UserId,
) {
  /// Submit a new report. Awards 10 points and checks badge thresholds.
  public shared ({ caller }) func submitReport(args : ReportTypes.SubmitReportArgs) : async Common.ReportId {
    if (caller.isAnonymous()) { Runtime.trap("anonymous not allowed") };
    // Ensure caller has a profile (auto-create with principal text as username if needed)
    ignore UserLib.getOrCreateProfile(users, caller, caller.toText());
    let nextId = reportIdCounter.at(0);
    let (reportId, newNextId) = ReportLib.submitReport(reports, nextId, caller, args);
    reportIdCounter.put(0, newNextId);
    UserLib.addPoints(users, caller, 10);
    UserLib.incrementReportCount(users, caller);
    UserLib.awardBadgesIfEarned(users, caller);
    reportId;
  };

  /// Get a single report by ID.
  public query func getReport(reportId : Common.ReportId) : async ?ReportTypes.ReportPublic {
    ReportLib.getReport(reports, reportId);
  };

  /// Get all approved reports (for map display).
  public query func getApprovedReports() : async [ReportTypes.ReportPublic] {
    ReportLib.getApprovedReports(reports);
  };

  /// Get all reports (admin or for heatmap — returns all regardless of status).
  public query func getAllReports() : async [ReportTypes.ReportPublic] {
    ReportLib.getAllReports(reports);
  };

  /// Get heatmap data: lat/lng + weight for all reports.
  public query func getHeatmapData() : async [ReportTypes.HeatmapPoint] {
    ReportLib.getHeatmapData(reports);
  };

  /// Get reports submitted by a specific user.
  public query func getReportsByUser(userId : Common.UserId) : async [ReportTypes.ReportPublic] {
    ReportLib.getReportsByUser(reports, userId);
  };

  /// Update a report's status (admin only).
  public shared ({ caller }) func updateReportStatus(
    reportId : Common.ReportId,
    status : ReportTypes.ReportStatus,
  ) : async Bool {
    if (caller != adminPrincipal) { Runtime.trap("unauthorized") };
    ReportLib.updateReportStatus(reports, reportId, status);
  };
};
