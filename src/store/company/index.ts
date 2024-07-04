// ** Redux Imports
import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { CompanyCountry, CompanyDetails, Currency, UserProfileDetails } from 'src/generated-sources/swagger-api'
import {
  CompanyCreateParams,
  DataParams,
  LeadStatusAddParams,
  LeadStatusDeleteParams,
  UserProfileUpdateCompanyParams
} from 'src/types/global'
import { changeUserPassword, deleteUser, getUserProfile, postInviteUser } from 'src/store/user'

export const getAllCompanyUsers: any = createAsyncThunk('getAllCompanyUsers', async (params: DataParams) => {
  const response = await params.backendApi.userCompanyDetailsApi.getCompanyUsers(params.languageCode)

  return response.data
})

export const updateCompanyInfo: any = createAsyncThunk(
  'updateCompanyInfo',
  async (params: UserProfileUpdateCompanyParams) => {
    const { backendApi, languageCode, ...rest } = params
    const response = await backendApi.userCompanyDetailsApi.userProfileUpdateCompany(
      rest.name,
      rest.city,
      rest.state,
      rest.country,
      rest.postalCode,
      rest.portalCountries,
      undefined,
      rest.faviconIcon,
      rest.taxNumber,
      rest.billingAddress,
      rest.commonProcurementVocabulary,
      rest.currency,
      rest.termPriority
    )

    return { params, response }
  }
)

export const companyRegisterPost: any = createAsyncThunk('companyRegisterPost', async (params: CompanyCreateParams) => {
  const { backendApi, languageCode, ...rest } = params

  const response = await backendApi.userCompanyDetailsApi.companyRegisterPost(
    rest.name,
    rest.portalCountries,
    rest.city,
    rest.state,
    rest.country,
    rest.postalCode,

    undefined,
    rest.faviconIcon,
    rest.taxNumber,
    rest.billingAddress,
    rest.currency
  )

  return { params, response }
})

export const updatePartiallyCompanyInfo: any = createAsyncThunk(
  'updatePartiallyCompanyInfo',
  async (params: UserProfileUpdateCompanyParams) => {
    const { backendApi, languageCode, ...rest } = params

    const response = await backendApi.userCompanyDetailsApi.userProfileUpdateCompany(
      rest.name,
      rest.city,
      rest.state,
      rest.country,
      rest.postalCode,
      rest.portalCountries,
      undefined,
      rest.faviconIcon,
      rest.taxNumber,
      rest.billingAddress,
      rest.commonProcurementVocabulary,
      rest.currency
    )

    return { params, response }
  }
)

export const newLeadStatusAdd: any = createAsyncThunk('newLeadStatusAdd', async (params: LeadStatusAddParams) => {
  const response = await params.backendApi.leadStatusApi.postLeadStatus(params.languageCode, params.leadStatus)

  return response.data
})

export const leadStatusDelete: any = createAsyncThunk('leadStatusDelete', async (params: LeadStatusDeleteParams) => {
  const response = await params.backendApi.leadStatusApi.deleteLeadStatus(params.languageCode, params.leadStatus.id)

  return { params, response }
})

export const companySlice = createSlice({
  name: 'Company',
  initialState: {
    users: {
      data: [] as Array<UserProfileDetails>,
      isLoading: false
    },
    info: {
      data: {} as CompanyDetails,
      isLoading: false
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllCompanyUsers.fulfilled, (state, action) => {
        state.users.data = action.payload
        state.users.isLoading = false
      })
      .addCase(companyRegisterPost.fulfilled, (state, action) => {
        state.info = action.payload.response
        state.users.isLoading = false
      })
      .addCase(postInviteUser.fulfilled, (state, action) => {
        state.users.data = [...state.users.data, action.payload]
        state.users.isLoading = false
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.data = state.users.data.filter(user => user.email !== action.payload.params.email)
        state.users.isLoading = false
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.info.data = { ...state.info.data, ...action.payload.response.data }
        state.info.isLoading = false
      })
      .addCase(updatePartiallyCompanyInfo.fulfilled, (state, action) => {
        state.info.data = { ...state.info.data, ...action.payload.response.data, isRegistrationRequired: true }
        state.info.isLoading = false
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.users.isLoading = false
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.info.data = action.payload.response.data.company
        state.info.isLoading = false
      })
      .addCase(newLeadStatusAdd.fulfilled, (state, action) => {
        state.info.data.leadStatuses = [...(state.info.data.leadStatuses ?? []), ...action.payload]
        state.info.isLoading = false
      })
      .addCase(leadStatusDelete.fulfilled, (state, action) => {
        state.info.data.leadStatuses = state?.info?.data?.leadStatuses?.filter(
          item => item.id !== action.payload.params.leadStatus?.id
        )
        state.info.isLoading = false
      })
      .addMatcher(isAnyOf(getAllCompanyUsers.pending, getAllCompanyUsers.rejected), (state, action) => {
        state.users.isLoading = true
      })
      .addMatcher(
        isAnyOf(
          postInviteUser.pending,
          postInviteUser.rejected,
          deleteUser.pending,
          deleteUser.rejected,
          changeUserPassword.pending,
          changeUserPassword.rejected
        ),
        (state, action) => {
          state.users.isLoading = true
        }
      )
      .addMatcher(
        isAnyOf(
          getUserProfile.pending,
          getUserProfile.rejected,
          updateCompanyInfo.pending,
          updateCompanyInfo.rejected,
          updatePartiallyCompanyInfo.pending,
          updatePartiallyCompanyInfo.rejected,
          newLeadStatusAdd.pending,
          newLeadStatusAdd.rejected,
          leadStatusDelete.pending,
          leadStatusDelete.rejected
        ),
        (state, action) => {
          state.info.isLoading = true
        }
      )
  }
})

export default companySlice.reducer
