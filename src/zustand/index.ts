import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createDataSlice, type IDataSlice } from './slices/createDataSlice';
// import { createUserSlice, type IUserSlice } from './slices/createUserSlice';

type IStore = {} & IDataSlice;

const useDataStore: any = create(
  devtools(
    immer(
      persist<IStore>(
        (set, get, api) => ({
          // ...createUserSlice(set, get, api),
          ...createDataSlice(set, get, api),
        }),
        {
          skipHydration: true,
          name: 'udh-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
      ),
    ),
  ),
);

export default useDataStore;
