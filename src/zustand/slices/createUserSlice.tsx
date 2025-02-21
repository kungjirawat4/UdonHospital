import type { StateCreator } from 'zustand/vanilla';

export type UserInfo = {
  readonly id?: string;
  name: string;
  email: string;
  token: null;
  role: string;
  mobile: number;
  routes: any[];
  menu: any[];
  image?: string;
};

export type IUserSlice = {
  UserInfo: UserInfo | null;
  requestLoading: boolean;
  setAuthUser: (user: UserInfo | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
  updateUserInfo: (userInfo: UserInfo) => void;
  reset: () => void;
};

// export type UserInfoStore = {
//   UserInfo: UserInfo;
//   updateUserInfo: (userInfo: UserInfo) => void;
//   logout: () => void;
// };

export const createUserSlice: StateCreator<IUserSlice> = set => ({
  UserInfo: null,
  requestLoading: false,
  setAuthUser: user => set(state => ({ ...state, UserInfo: user })),
  setRequestLoading: isLoading =>
    set(state => ({ ...state, requestLoading: isLoading })),
  updateUserInfo: (userInfo: UserInfo) => (state: { userInfo: UserInfo }) => ({
    userInfo: {
      ...state.userInfo,
      ...userInfo,
    },
  }),
  logout: () => (state: { userInfo: UserInfo }) => ({
    userInfo: {
      ...state.userInfo,
      id: '',
      name: '',
      email: '',
      token: null,
      role: '',
      mobile: 0,
      routes: [],
      menu: [],
      image: '',
    },
  }),
  reset: () => set({ UserInfo: null, requestLoading: false }),
});
