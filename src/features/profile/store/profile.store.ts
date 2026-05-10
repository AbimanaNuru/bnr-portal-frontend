import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProfileMeResponse } from "../types/profile.type";

interface ProfileState {
  profile: ProfileMeResponse | null;
  
  setProfile: (profile: ProfileMeResponse | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "mavo-profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
