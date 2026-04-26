import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserProfilePublic } from "../types";

export function useAuth() {
  const {
    loginStatus,
    isAuthenticated,
    isInitializing,
    login,
    clear,
    identity,
  } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfilePublic | null>({
    queryKey: ["myProfile", isAuthenticated],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const needsRegistration =
    isAuthenticated && !profileLoading && profile === null;

  return {
    loginStatus,
    isLoggedIn: isAuthenticated,
    isInitializing,
    identity,
    profile,
    profileLoading,
    needsRegistration,
    login,
    logout: clear,
    refetchProfile,
  };
}
