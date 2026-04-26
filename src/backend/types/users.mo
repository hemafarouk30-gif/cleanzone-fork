import Common "common";

module {
  public type BadgeId = {
    #first_report;
    #ten_reports;
    #fifty_reports;
    #hundred_reports;
    #pioneer;
    #eco_warrior;
  };

  public type BadgeMetadata = {
    id : BadgeId;
    name : Text;
    icon : Text;
    milestone : Text;
  };

  public type UserProfile = {
    id : Common.UserId;
    var username : Text;
    var avatarUrl : ?Text;
    joinedAt : Common.Timestamp;
    var points : Nat;
    var badges : [BadgeId];
    var reportCount : Nat;
  };

  // Shared (immutable) version for API boundary
  public type UserProfilePublic = {
    id : Common.UserId;
    username : Text;
    avatarUrl : ?Text;
    joinedAt : Common.Timestamp;
    points : Nat;
    badges : [BadgeId];
    reportCount : Nat;
  };

  public type LeaderboardEntry = {
    rank : Nat;
    userId : Common.UserId;
    username : Text;
    points : Nat;
    badgeCount : Nat;
  };
};
