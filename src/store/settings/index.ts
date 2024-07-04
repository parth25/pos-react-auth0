// ** Redux Imports
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { GetUserSettingsPersonalParams, PutUserSettingsPersonalParams } from 'src/types/global'

export const getAllUserSettingsPersonal: any = createAsyncThunk(
  'getAllUserSettingsPersonal',
  async (params: GetUserSettingsPersonalParams) => {
    const response = await params.backendApi.settingsApi.userSettingsPersonalGet(params.settingName)

    return { params, response }
  }
)

export const getUserSettingsPersonal: any = createAsyncThunk(
  'getUserSettingsPersonal',
  async (params: GetUserSettingsPersonalParams) => {
    const response = await params.backendApi.settingsApi.userSettingsPersonalGet(params.settingName)

    return { params, response }
  }
)

export const putUserSettingsPersonal: any = createAsyncThunk(
  'putUserSettingsPersonal',
  async (params: PutUserSettingsPersonalParams) => {
    const response = await params.backendApi.settingsApi.userSettingsPersonalPut(
      params.settingName,
      params.settingValue
    )

    return { params, response }
  }
)

export const settingsSlice = createSlice({
  name: 'Settings',
  initialState: {
    user: {
      data: {} as any,
      isLoading: false
    },
    company: {
      data: {} as any,
      isLoading: false
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllUserSettingsPersonal.fulfilled, (state, action) => {
        state.user.data = action.payload.response.data
        state.user.isLoading = false
      })
      .addCase(getUserSettingsPersonal.fulfilled, (state, action) => {
        const {
          params: { settingName },
          response: { data: settingValue }
        } = action.payload
        state.user.data = {
          ...state.user.data,
          [settingName]: settingValue
        }
        state.user.isLoading = false
      })
      .addCase(putUserSettingsPersonal.fulfilled, (state, action) => {
        const { settingName, settingValue, ...rest } = action.payload.params
        state.user.data = {
          ...state.user.data,
          [settingName]: settingValue
        }
        state.user.isLoading = false
      })
      .addMatcher(
        isAnyOf(
          getUserSettingsPersonal.pending,
          getUserSettingsPersonal.rejected,
          getAllUserSettingsPersonal.pending,
          getAllUserSettingsPersonal.rejected,
          putUserSettingsPersonal.pending,
          putUserSettingsPersonal.rejected
        ),
        (state, action) => {
          state.user.isLoading = true
        }
      )
  }
})

export default settingsSlice.reducer
