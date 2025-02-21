import type { StateCreator } from 'zustand/vanilla';

export type IDataSlice = {
  data: { id: string; data: any[] }[];
  setData: (data: { id: string; data: any[] }) => void;

  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
};

export const createDataSlice: StateCreator<IDataSlice> = set => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => set({ dialogOpen }),

  data: [{ id: '', data: [] }],
  setData: (data: { id: string; data: any[] }) => {
    return set((state: any) => {
      const newData = state.data.filter((x: any) => x.id !== data.id);
      return {
        data: [...newData, data],
      };
    });
  },
});
