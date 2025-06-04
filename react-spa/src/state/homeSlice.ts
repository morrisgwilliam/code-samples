import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Dispatch } from "redux"
import type { NBATeam } from '@balldontlie/sdk';
import { DEFAULT_API_KEY, getAllTeams, getPlayersByTeamId } from "../api"
import type { RootState } from "./store";
import { countDraftRounds } from "../helpers";

type PaginationModel = {
  page: number,
  pageSize: number,
}

// Profile Slice Interface and Initial State
export interface HomeState {
  teams: NBATeam[],
  selectedTeam?: NBATeam,
  loadingPlayers: boolean,
  draftBreakdown: Record<string, number>,
  paginationModel: PaginationModel,
  apiKey: string,
}

const initialState: HomeState = {
  teams: [],
  loadingPlayers: false,
  draftBreakdown: {},
  paginationModel: {
    page: 0,
    pageSize: 100,
  },
  apiKey: DEFAULT_API_KEY,
}

// Profile Slice
export const HomeSlice = createSlice({
  name: "Home",
  initialState,
  reducers: {
    setTeams: (
      state,
      action: PayloadAction<NBATeam[]>,
    ) => ({
      ...state,
      teams: action.payload,
    }),
    setLoadingPlayers: (
      state,
      action: PayloadAction<boolean>,
    ) => ({
      ...state,
      loadingPlayers: action.payload,
    }),
    setDraftBreakdown: (
      state,
      action: PayloadAction<Record<string, number>>,
    ) => ({
      ...state,
      draftBreakdown: action.payload,
    }),
    setPaginationModel: (
      state,
      action: PayloadAction<PaginationModel>,
    ) => ({
      ...state,
      paginationModel: action.payload,
    }),
    setApiKey: (
      state,
      action: PayloadAction<string>,
    ) => ({
      ...state,
      apiKey: action.payload,
    }),
    selectTeam: (
      state,
      action: PayloadAction<NBATeam | undefined>,
    ) => ({
      ...state,
      selectedTeam: action.payload,
    }),
  },
})

export const {
  setTeams,
  setPaginationModel,
  setLoadingPlayers,
  setDraftBreakdown,
  setApiKey,
  selectTeam,
} = HomeSlice.actions
export default HomeSlice.reducer

export const getTeams = () => async (
  dispatch: Dispatch,
): Promise<void> => {
  try {
    const result = await getAllTeams()
    dispatch(setTeams(result))
  } catch (e) {
    // We can write some nice error handling here. For now let's just log it.
    console.log('Unable to fetch all NBA teams.', e);
    alert('Unable to fetch all NBA teams. Please check the console log for more info. This is likely a network error due to RATE LIMITING.');
  }
}

export const getDraftCounts = () => async (
  dispatch: Dispatch,
  getState: () => RootState
): Promise<void> => {
  try {
  dispatch(setLoadingPlayers(true))
  const { paginationModel, selectedTeam } = getState().home
  
  if( !selectedTeam) return

  const players = await getPlayersByTeamId({
    team_ids: [selectedTeam.id],
    per_page: paginationModel.pageSize,
  })

  const draftRoundCounts = countDraftRounds(players);

  dispatch(setDraftBreakdown(draftRoundCounts))
  dispatch(setLoadingPlayers(false))
  } catch (e) {
    // We can write some nice error handling here. For now let's just log it.
    console.log('Unable to create draft round breakdown.', e);
    alert('Unable to create draft round breakdown. Please check the console log for more info. This is likely a network errordue to RATE LIMITING');
} finally {
  setLoadingPlayers(false);
}
}