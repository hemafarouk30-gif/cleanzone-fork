import Common "../types/common";
import Types "../types/users";
import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func toPublic(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      username = profile.username;
      avatarUrl = profile.avatarUrl;
      joinedAt = profile.joinedAt;
      points = profile.points;
      badges = profile.badges;
      reportCount = profile.reportCount;
    };
  };

  public func getProfile(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfilePublic {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) { ?toPublic(profile) };
      case null { null };
    };
  };

  public func getOrCreateProfile(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
    username : Text,
  ) : Types.UserProfilePublic {
    switch (users.find(func(u) { u.id == userId })) {
      case (?existing) {
        existing.username := username;
        toPublic(existing);
      };
      case null {
        // Pioneer badge: first 10 users to join
        let isPioneer = users.size() < 10;
        let initialBadges : [Types.BadgeId] = if (isPioneer) { [#pioneer] } else { [] };
        let newProfile : Types.UserProfile = {
          id = userId;
          var username = username;
          var avatarUrl = null;
          joinedAt = Time.now();
          var points = 0;
          var badges = initialBadges;
          var reportCount = 0;
        };
        users.add(newProfile);
        toPublic(newProfile);
      };
    };
  };

  public func updateUsername(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
    username : Text,
  ) : Bool {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) {
        profile.username := username;
        true;
      };
      case null { false };
    };
  };

  public func updateAvatar(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
    avatarUrl : ?Text,
  ) : Bool {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) {
        profile.avatarUrl := avatarUrl;
        true;
      };
      case null { false };
    };
  };

  public func addPoints(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
    points : Nat,
  ) {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) { profile.points := profile.points + points };
      case null {};
    };
  };

  public func incrementReportCount(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) { profile.reportCount := profile.reportCount + 1 };
      case null {};
    };
  };

  func hasBadge(badges : [Types.BadgeId], b : Types.BadgeId) : Bool {
    badges.find(func(x) { x == b }) != null;
  };

  public func awardBadgesIfEarned(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
  ) {
    switch (users.find(func(u) { u.id == userId })) {
      case (?profile) {
        let count = profile.reportCount;
        let pts = profile.points;
        var current = profile.badges;

        if (count >= 1 and not hasBadge(current, #first_report)) {
          current := current.concat([#first_report]);
        };
        if (count >= 10 and not hasBadge(current, #ten_reports)) {
          current := current.concat([#ten_reports]);
        };
        if (count >= 50 and not hasBadge(current, #fifty_reports)) {
          current := current.concat([#fifty_reports]);
        };
        if (count >= 100 and not hasBadge(current, #hundred_reports)) {
          current := current.concat([#hundred_reports]);
        };
        if (pts >= 100 and not hasBadge(current, #eco_warrior)) {
          current := current.concat([#eco_warrior]);
        };

        profile.badges := current;
      };
      case null {};
    };
  };

  func sortedByPoints(users : List.List<Types.UserProfile>) : [Types.UserProfile] {
    let arr = users.toArray();
    arr.sort(
      func(a, b) {
        if (a.points > b.points) { #less }
        else if (a.points < b.points) { #greater }
        else { #equal };
      }
    );
  };

  public func getLeaderboard(
    users : List.List<Types.UserProfile>,
    limit : Nat,
  ) : [Types.LeaderboardEntry] {
    let sorted = sortedByPoints(users);
    let count = if (limit < sorted.size()) { limit } else { sorted.size() };
    Array.tabulate<Types.LeaderboardEntry>(
      count,
      func(i) {
        let p = sorted[i];
        {
          rank = i + 1;
          userId = p.id;
          username = p.username;
          points = p.points;
          badgeCount = p.badges.size();
        };
      },
    );
  };

  // Returns the user's rank (1-based) among all users sorted by points desc. Returns 0 if not found.
  public func getUserRank(
    users : List.List<Types.UserProfile>,
    userId : Common.UserId,
  ) : Nat {
    let sorted = sortedByPoints(users);
    var rank = 0;
    var i = 0;
    while (i < sorted.size()) {
      if (sorted[i].id == userId) {
        rank := i + 1;
        i := sorted.size();
      } else {
        i := i + 1;
      };
    };
    rank;
  };
};
