import Common "common";

module {
  public type ReportCategory = {
    #garbage;
    #pollution;
    #unsafe;
    #other;
  };

  public type ReportStatus = {
    #pending;
    #approved;
    #resolved;
  };

  public type Report = {
    id : Common.ReportId;
    reporter : Common.UserId;
    photoUrl : Text;
    lat : Float;
    lng : Float;
    description : Text;
    category : ReportCategory;
    var status : ReportStatus;
    createdAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type ReportPublic = {
    id : Common.ReportId;
    reporter : Common.UserId;
    photoUrl : Text;
    lat : Float;
    lng : Float;
    description : Text;
    category : ReportCategory;
    status : ReportStatus;
    createdAt : Common.Timestamp;
  };

  public type HeatmapPoint = {
    lat : Float;
    lng : Float;
    weight : Nat;
  };

  public type SubmitReportArgs = {
    photoUrl : Text;
    lat : Float;
    lng : Float;
    description : Text;
    category : ReportCategory;
  };
};
