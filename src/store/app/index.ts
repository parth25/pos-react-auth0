// ** Redux Imports
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  AddPortalCredentialsParams,
  DataParams,
  DeletePortalCredentialsParams,
  UpdatePortalCredentialsParams
} from 'src/types/global'
import {
  CommonProcurementVocabulary as CommonProcurementVocabularyInterface,
  CompanyLeadPortal,
  Currency,
  LeadPortalType,
  PortalCountry,
  Role
} from 'src/generated-sources/swagger-api'
import { createTree, getLeafNodes } from 'src/utils/miscellaneous'

export class CommonProcurementVocabulary {
  private cpvs: Map<number, CommonProcurementVocabularyInterface & any>

  constructor(cpvs: CommonProcurementVocabularyInterface[]) {
    this.cpvs = new Map(cpvs.map(cpv => [cpv.id!, cpv]))
  }

  public getTree() {
    return createTree(this.getCpvs(), 'id', 'parentId')
  }

  public getCpvs(): CommonProcurementVocabularyInterface[] {
    return Array.from(this.cpvs.values())
  }

  public getIds(): number[] {
    return Array.from(this.cpvs.keys())
  }

  public getCpv(cpv: CommonProcurementVocabularyInterface) {
    this.cpvs.set(cpv.id!, cpv)
  }

  public getAllChildrenOnly() {
    return getLeafNodes(this.getTree())
  }
}

export const addPortalCredentials: any = createAsyncThunk(
  'addPortalCredentials',
  async (params: AddPortalCredentialsParams, thunkAPI) => {
    const { backendApi, leadPortalWithCredential } = params
    const response = await backendApi.leadPortalApi.leadPortalCredentialPost(leadPortalWithCredential)
    await thunkAPI.dispatch(getAllCompanyLeadPortals(params))

    return { response }
  }
)

export const updatedPortalCredentials: any = createAsyncThunk(
  'updatedPortalCredentials',
  async (params: UpdatePortalCredentialsParams, thunkAPI) => {
    const { backendApi, leadPortalWithCredential } = params

    const response = await backendApi.leadPortalApi.leadPortalCredentialPost(leadPortalWithCredential)

    return { response, leadPortalWithCredential }
  }
)

export const deletePortalCredentials: any = createAsyncThunk(
  'deletePortalCredentials',
  async (params: DeletePortalCredentialsParams, thunkAPI) => {
    const { backendApi, portalId, portalType } = params
    const response = await backendApi.leadPortalApi.deleteLeadPortalCredentials(portalId)
    thunkAPI.dispatch({ type: 'User/deleteLeadPortal', payload: portalId })

    return { params, response }
  }
)
export const getAllCpv: any = createAsyncThunk('getAllCpv', async (params: DataParams) => {
  const response = await params.backendApi.commonProcurementVocabularyApi.commonProcurementVocabulariesGet(
    params.languageCode
  )

  return response.data
})

export const getAllCompanyLeadPortals: any = createAsyncThunk(
  'getAllCompanyLeadPortals',
  async (params: DataParams) => {
    const response = await params.backendApi.companyLeadPortalApi.companyLeadPortalGet(params.languageCode, [
      'PUBLIC',
      'PRIVATE',
      'PAID'
    ] as LeadPortalType[])

    return response.data
  }
)

export const getAllRoles: any = createAsyncThunk('getAllRoles', async (params: DataParams) => {
  const response = await params.backendApi.generalApi.generalRoles(params.languageCode)

  return response.data
})

export const getAllCurrencies: any = createAsyncThunk('getAllCurrencies', async (params: DataParams) => {
  const response = await params.backendApi.generalApi.generalCurrency(params.languageCode)

  return response.data
})

export const getAllPortalCountries: any = createAsyncThunk('getAllPortalCountries', async (params: DataParams) => {
  const response = await params.backendApi.generalApi.generalCountries(params.languageCode)

  return response.data
})

export const appSlice = createSlice({
  name: 'App',
  initialState: {
    cpv: {
      data: new CommonProcurementVocabulary([]),
      isLoading: false
    },
    currencies: {
      data: [] as Array<Currency>,
      isLoading: false
    },
    portalCountries: {
      data: [] as Array<PortalCountry>,
      isLoading: false
    },
    leadPortals: {
      data: [] as Array<CompanyLeadPortal>,
      isLoading: false
    },
    roles: {
      data: [] as Array<Role>,
      isLoading: false
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllCpv.fulfilled, (state, action) => {
        state.cpv.data = new CommonProcurementVocabulary(action.payload)
        state.cpv.isLoading = false
      })
      .addCase(getAllCompanyLeadPortals.fulfilled, (state, action) => {
        action.payload.sort((nodeA: CompanyLeadPortal, nodeB: CompanyLeadPortal) => {
          return nodeA.leadPortal.name.localeCompare(nodeB.leadPortal.name)
        })
        state.leadPortals.data = action.payload
        state.leadPortals.isLoading = false
      })
      .addCase(addPortalCredentials.fulfilled, (state, action) => {
        state.leadPortals.isLoading = false
      })
      .addCase(updatedPortalCredentials.fulfilled, (state, action) => {
        const updatedPortals = state.leadPortals.data.map(portal => {
          if (portal.leadPortal.id === action?.payload?.leadPortalWithCredential?.leadPortal.id) {
            return {
              ...portal,
              credential: {
                ...portal.credential,
                username: action?.payload?.leadPortalWithCredential?.credential?.username
              }
            }
          }

          return portal
        })
        state.leadPortals.data = updatedPortals
        state.leadPortals.isLoading = false
      })
      .addCase(deletePortalCredentials.fulfilled, (state, action) => {
        if (action.payload.params.portalType === 'PUBLIC') {
          state.leadPortals.data = state.leadPortals.data.map(portal => {
            if (portal?.leadPortal?.id === action.payload.params.portalId) {
              return {
                ...portal,
                credential: {
                  username: null,
                  password: null
                }
              } as unknown as CompanyLeadPortal
            }
            return portal
          })
        } else {
          state.leadPortals.data = state.leadPortals.data.filter(
            portal => portal?.leadPortal?.id !== action.payload.params.portalId
          )
        }
        state.leadPortals.isLoading = false
      })
      .addCase(getAllCurrencies.fulfilled, (state, action) => {
        state.currencies.data = action.payload
        state.currencies.isLoading = false
      })
      .addCase(getAllPortalCountries.fulfilled, (state, action) => {
        state.portalCountries.data = action.payload
        state.portalCountries.isLoading = false
      })

      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.roles.data = action.payload
        state.roles.isLoading = false
      })

      .addMatcher(
        isAnyOf(
          getAllCompanyLeadPortals.pending,
          addPortalCredentials.pending,
          updatedPortalCredentials.pending,
          deletePortalCredentials.pending,
          getAllCompanyLeadPortals.rejected,
          addPortalCredentials.rejected,
          updatedPortalCredentials.rejected,
          deletePortalCredentials.rejected
        ),
        (state, action) => {
          state.leadPortals.isLoading = true
        }
      )
      .addMatcher(isAnyOf(getAllCpv.pending, getAllCpv.rejected), (state, action) => {
        state.cpv.isLoading = true
      })
      .addMatcher(isAnyOf(getAllCurrencies.pending, getAllCurrencies.rejected), (state, action) => {
        state.currencies.isLoading = true
      })
      .addMatcher(isAnyOf(getAllPortalCountries.pending, getAllPortalCountries.rejected), (state, action) => {
        state.portalCountries.isLoading = true
      })
      .addMatcher(isAnyOf(getAllRoles.pending, getAllRoles.rejected), (state, action) => {
        state.roles.isLoading = true
      })
  }
})

export default appSlice.reducer
