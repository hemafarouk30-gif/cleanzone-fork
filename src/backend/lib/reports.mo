import Common "../types/common";
import Types "../types/reports";
import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";

module {
  public func toPublic(report : Types.Report) : Types.ReportPublic {
    {
      id = report.id;
      reporter = report.reporter;
      photoUrl = report.photoUrl;
      lat = report.lat;
      lng = report.lng;
      description = report.description;
      category = report.category;
      status = report.status;
      createdAt = report.createdAt;
    };
  };

  public func submitReport(
    reports : List.List<Types.Report>,
    nextId : Nat,
    reporter : Common.UserId,
    args : Types.SubmitReportArgs,
  ) : (Common.ReportId, Nat) {
    let id = nextId;
    let report : Types.Report = {
      id = id;
      reporter = reporter;
      photoUrl = args.photoUrl;
      lat = args.lat;
      lng = args.lng;
      description = args.description;
      category = args.category;
      var status = #approved; // auto-approve for demo
      createdAt = Time.now();
    };
    reports.add(report);
    (id, nextId + 1);
  };

  public func getReport(
    reports : List.List<Types.Report>,
    reportId : Common.ReportId,
  ) : ?Types.ReportPublic {
    switch (reports.find(func(r) { r.id == reportId })) {
      case (?report) { ?toPublic(report) };
      case null { null };
    };
  };

  public func getApprovedReports(
    reports : List.List<Types.Report>,
  ) : [Types.ReportPublic] {
    reports
      .filter(func(r) { r.status == #approved })
      .map<Types.Report, Types.ReportPublic>(func(r) { toPublic(r) })
      .toArray();
  };

  public func getAllReports(
    reports : List.List<Types.Report>,
  ) : [Types.ReportPublic] {
    reports
      .map<Types.Report, Types.ReportPublic>(func(r) { toPublic(r) })
      .toArray();
  };

  // Grid-based heatmap: bucket lat/lng into ~1km cells (0.01 degree ≈ 1.1km).
  // Uses integer keys (lat*100 and lng*100 as Int) to avoid Float equality issues.
  public func getHeatmapData(
    reports : List.List<Types.Report>,
  ) : [Types.HeatmapPoint] {
    // Key: (latGrid, lngGrid) encoded as a single Int = latGrid * 100000 + lngGrid
    // latGrid = (lat * 100).toInt(), lngGrid = (lng * 100).toInt()
    let grid = Map.empty<Int, Types.HeatmapPoint>();

    reports.forEach(func(report) {
      let latGrid = (report.lat * 100.0).toInt();
      let lngGrid = (report.lng * 100.0).toInt();
      // Encode pair as single Int key: latGrid shifted by a large offset to handle negatives
      let key : Int = latGrid * 100_000 + lngGrid;
      switch (grid.get(key)) {
        case (?existing) {
          grid.add(key, { existing with weight = existing.weight + 1 });
        };
        case null {
          let centerLat = latGrid.toFloat() / 100.0;
          let centerLng = lngGrid.toFloat() / 100.0;
          grid.add(key, { lat = centerLat; lng = centerLng; weight = 1 });
        };
      };
    });

    grid.values().toArray();
  };

  public func getReportsByUser(
    reports : List.List<Types.Report>,
    userId : Common.UserId,
  ) : [Types.ReportPublic] {
    reports
      .filter(func(r) { r.reporter == userId })
      .map<Types.Report, Types.ReportPublic>(func(r) { toPublic(r) })
      .toArray();
  };

  public func updateReportStatus(
    reports : List.List<Types.Report>,
    reportId : Common.ReportId,
    status : Types.ReportStatus,
  ) : Bool {
    switch (reports.find(func(r) { r.id == reportId })) {
      case (?report) {
        report.status := status;
        true;
      };
      case null { false };
    };
  };
};
