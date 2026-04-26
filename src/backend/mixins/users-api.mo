import Common "../types/common";
import Types "../types/users";
import UserLib "../lib/users";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  users : List.List<Types.UserProfile>,
) {
  /// Register or update the caller's profile (upsert). Returns the updated profile.
  /// Pioneer badge is auto-awarded if the caller is among the first 10 registered users.
  public shared ({ caller }) func registerProfile(username : Text) : async Types.UserProfilePublic {
    if (caller.isAnonymous()) { Runtime.trap("anonymous not allowed") };
    UserLib.getOrCreateProfile(users, caller, username);
  };

  /// Get any user's public profile by ID.
  public query func getUserProfile(userId : Common.UserId) : async ?Types.UserProfilePublic {
    UserLib.getProfile(users, userId);
  };

  /// Get the caller's own profile.
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfilePublic {
    UserLib.getProfile(users, caller);
  };

  /// Update the caller's avatar URL.
  public shared ({ caller }) func updateAvatar(avatarUrl : ?Text) : async Bool {
    if (caller.isAnonymous()) { Runtime.trap("anonymous not allowed") };
    UserLib.updateAvatar(users, caller, avatarUrl);
  };

  /// Get the top-50 leaderboard sorted by points descending.
  public query func getLeaderboard() : async [Types.LeaderboardEntry] {
    UserLib.getLeaderboard(users, 50);
  };

  /// Get the caller's rank on the leaderboard (1-based). Returns 0 if not registered.
  public shared query ({ caller }) func getMyRank() : async Nat {
    UserLib.getUserRank(users, caller);
  };

  /// Get metadata for all badge types.
  public query func getBadgeMetadata() : async [Types.BadgeMetadata] {
    [
      { id = #pioneer; name = "Pioneer"; icon = "🏆"; milestone = "Among the first 10 users" },
      { id = #first_report; name = "First Report"; icon = "📋"; milestone = "Submit your first report" },
      { id = #ten_reports; name = "Active Reporter"; icon = "🔟"; milestone = "Submit 10 reports" },
      { id = #fifty_reports; name = "Community Guardian"; icon = "🛡️"; milestone = "Submit 50 reports" },
      { id = #hundred_reports; name = "CleanZone Champion"; icon = "🌟"; milestone = "Submit 100 reports" },
      { id = #eco_warrior; name = "Eco Warrior"; icon = "♻️"; milestone = "Earn 100 points" },
    ];
  };
};
