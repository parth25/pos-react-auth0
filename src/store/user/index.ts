// ** Redux Imports
import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'

// ** Axios Imports
import { UserProfileDetails } from 'src/generated-sources/swagger-api'
import {
  ChangeUserPasswordParams,
  DataParams,
  DeleteUserParams,
  PostInviteUserParams,
  PutUserLeadPortalsParams,
  UserProfileSaveParams,
  UserProfileUpdateParams
} from 'src/types/global'
import { updateCompanyInfo } from 'src/store/company'

export const getUserProfile: any = createAsyncThunk('getUserProfile', async (params: DataParams) => {
  const response = await params.backendApi.userProfileDetailsApi.userProfile(params.languageCode)

  return { params, response }
})

export const userProfileSave: any = createAsyncThunk('userProfileSave', async (params: UserProfileSaveParams) => {
  const { backendApi, languageCode, ...rest } = params
  const response = await backendApi.userProfileDetailsApi.userProfileSet(languageCode, rest)

  return { params, response }
})

export const putUserLeadPortals: any = createAsyncThunk(
  'putUserLeadPortals',
  async (params: PutUserLeadPortalsParams, { getState }) => {
    const { backendApi, languageCode, leadPortals } = params
    const state: any = getState()

    const response = await backendApi.userProfileDetailsApi.userProfileSet(languageCode, {
      ...state.user.profile.data,
      leadPortals: leadPortals
    })

    return { params, response }
  }
)

export const userSendVerificationEmail: any = createAsyncThunk(
  'userSendVerificationEmail',
  async (params: DataParams) => {
    await params.backendApi.userVerificationApi.userSendVerificationEmail()
  }
)

export const checkUserEmailVerified: any = createAsyncThunk('checkUserEmailVerified', async (params: DataParams) => {
  const response = await params.backendApi.userVerificationApi.userIsEmailVerified()

  return response.data
})

export const postInviteUser: any = createAsyncThunk('postInviteUser', async (params: PostInviteUserParams) => {
  const response = await params.backendApi.userAuthenticationApi.userInvitePost(
    params.languageCode,
    params.userInvitation
  )

  return response.data
})

export const deleteUser: any = createAsyncThunk('deleteUser', async (params: DeleteUserParams) => {
  const response = await params.backendApi.userManagementApi.userDeleteById(params.languageCode, params.email)

  return { params, response }
})

export const changeUserPassword: any = createAsyncThunk(
  'changeUserPassword',
  async (params: ChangeUserPasswordParams) => {
    const response = await params.backendApi.userAuthenticationApi.userChangePassword(params.userChangePasswordRequest)

    return { params, response }
  }
)

export const updateUserProfile: any = createAsyncThunk(
  'updateUserProfile',
  async (params: UserProfileUpdateParams, thunkAPI) => {
    thunkAPI.dispatch(userProfileSave(params.profile))
    thunkAPI.dispatch(updateCompanyInfo(params.company))
  }
)

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    profile: {
      data: {} as UserProfileDetails,
      isLoading: false
    }
  },
  reducers: {
    changeUserNeedToRegister(state, action: PayloadAction<boolean>) {
      state.profile.data = { ...state.profile, isRegistrationRequired: action.payload }
    },
    deleteLeadPortal(state, action: PayloadAction<number>) {
      state.profile.data.leadPortals = state?.profile?.data?.leadPortals?.filter(
        portal => portal?.id !== action?.payload
      )
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        const { company, ...profile } = action.payload.response.data
        state.profile.data = profile
        state.profile.isLoading = false
      })
      .addCase(userProfileSave.fulfilled, (state, action) => {
        const { company, ...profile } = action.payload.response.data
        state.profile.data = { ...state.profile.data, ...profile }
        state.profile.isLoading = false
      })
      .addCase(putUserLeadPortals.fulfilled, (state, action) => {
        const { company, ...profile } = action.payload.response.data
        state.profile.data = profile
        state.profile.isLoading = false
      })
      .addCase(checkUserEmailVerified.fulfilled, (state, action) => {
        state.profile.data.emailVerified = action.payload.isEmailVerified
      })
      .addMatcher(
        isAnyOf(
          userProfileSave.pending,
          userProfileSave.rejected,
          updateUserProfile.pending,
          updateUserProfile.rejected,
          getUserProfile.pending,
          getUserProfile.rejected,
          putUserLeadPortals.pending,
          putUserLeadPortals.rejected
        ),
        (state, action) => {
          state.profile.isLoading = true
        }
      )
  }
})

export default userSlice.reducer
