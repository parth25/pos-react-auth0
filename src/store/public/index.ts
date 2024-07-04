import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { LeadPortal } from 'src/generated-sources/swagger-api'
import { CompanyVocabularyAddParams } from 'src/types/global'

export const publicPortalGet: any = createAsyncThunk('publicPortalGet', async (params: CompanyVocabularyAddParams) => {
  const response = await params.backendApi.publicApi.getAllPublicLeadPortal(params.languageCode)

  return response
})

export const publicSlice = createSlice({
  name: 'PublicStore',
  initialState: {
    data: [] as Array<LeadPortal>,
    isLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(publicPortalGet.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.isLoading = false
      })

      .addMatcher(isAnyOf(publicPortalGet.pending), state => {
        state.isLoading = true
      })
      .addMatcher(isAnyOf(publicPortalGet.rejected), state => {
        state.isLoading = false
      })
  }
})

export default publicSlice.reducer
