import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { FileEntry } from 'src/generated-sources/swagger-api'
import {
  ContentDeleteParams,
  ContentDeleteTopicParams,
  ContentDownloadParams,
  ContentFilter,
  ContentFolderCreateParams,
  ContentInfoParams,
  ContentProductAssignParams,
  ContentLeadAssignParams,
  ContentTopicsParams,
  ContentUploadParams,
  GetAllDocumentsParams,
  ContentServiceAssignParams
} from 'src/types/global'
import { createTree, isDefined } from 'src/utils/miscellaneous'

export class Content {
  private files: Map<string, FileEntry & any>

  constructor(files: FileEntry[]) {
    this.files = new Map(files.map(file => [file.id!, file]))
  }

  public getTree() {
    return createTree(this.getFiles(), 'absPath', 'basePath')
  }

  public addFile(file: FileEntry) {
    this.files.set(file.id!, file)
  }

  public addFiles(files: Array<FileEntry>) {
    files.forEach(file => this.files.set(file.id!, file))
  }

  public getFiles(): FileEntry[] {
    return Array.from(this.files.values())
  }

  public getIds(): string[] {
    return Array.from(this.files.keys())
  }

  public getById(fileId: string): FileEntry | undefined {
    return this.files.get(fileId)
  }

  public deleteById(fileId: string): boolean {
    return this.files.delete(fileId)
  }

  public getCurrentContents(path: string): Array<FileEntry> {
    return Array.from(this.files.values()).filter(file => file.basePath === path)
  }

  public updateFile(fileId: string, isLoading: boolean, updates: Partial<FileEntry & any>) {
    if (this.files.has(fileId)) {
      this.files.set(fileId, { ...this.files.get(fileId), ...updates, isLoading: isLoading })
    }
  }
}

export const defaultContentFilter: ContentFilter = {
  basePath: '/'
}

export const getAllContents: any = createAsyncThunk('getAllContents', async (params: GetAllDocumentsParams) => {
  const response = await params.backendApi.storageApi.fileManagerList(params.basePath, params.languageCode)

  return { params, response }
})

export const contentUpload: any = createAsyncThunk('contentUpload', async (params: ContentUploadParams, thunkAPI) => {
  const response = await params.backendApi.storageApi.fileManagerUpload(
    params.languageCode,
    params.file,
    params.basePath,
    params.leads,
    params.assets,
    params.services,
    params.documentType,
    params.process,
    params.name,
    params.overwrite,
    params.options
  )

  return thunkAPI.dispatch(getAllContents({ ...params }))
})

export const contentDelete: any = createAsyncThunk('contentDelete', async (params: ContentDeleteParams, thunkAPI) => {
  const response = await params.backendApi.storageApi.fileManagerDelete(
    params.languageCode,
    params?.file?.absPath as string
  )

  return { params, response }
})

export const contentDownload: any = createAsyncThunk(
  'contentDownload',
  async (params: ContentDownloadParams, thunkAPI) => {
    const response = await params.backendApi.storageApi.fileManagerDownload(
      params.file.absPath as string,
      params?.options
    )

    return { params, response }
  }
)

export const contentTopics = createAsyncThunk('contentTopics', async (params: ContentTopicsParams, thunkAPI) => {
  const response = await params.backendApi.fileTopicsApi.fileManagerTopicsGet(
    params.languageCode,
    params.file.id as string,
    params.draw,
    params.page,
    params.pageSize,
    params.query
  )

  return { params, response }
})

export const contentInfo: any = createAsyncThunk('contentInfo', async (params: ContentInfoParams, thunkAPI) => {
  const response = await params.backendApi.storageApi.fileManagerGet(params.file.id as string, params.languageCode)

  return { params, response }
})

export const contentProductAssign: any = createAsyncThunk(
  'contentProductAssign',
  async (params: ContentProductAssignParams) => {
    const response = await params.backendApi.assetDocumentsApi.assetAssignDocument(
      params.product.id as string,
      params.file.id as string
    )

    return { params, response }
  }
)

export const contentServiceAssign: any = createAsyncThunk(
  'contentServiceAssign',
  async (params: ContentServiceAssignParams) => {
    const response = await params.backendApi.serviceDocumentsApi.serviceAssignDocument(
      params.service.id as string,
      params.file.id as string
    )

    return { params, response }
  }
)

export const contentLeadAssign: any = createAsyncThunk('contentLeadAssign', async (params: ContentLeadAssignParams) => {
  const response = await params.backendApi.leadDocumentsApi.leadAssignDocument(
    params.lead.id as number,
    params.file.id as string
  )

  return { params, response }
})

export const contentDeleteTopic = createAsyncThunk(
  'contentDeleteTopic',
  async (params: ContentDeleteTopicParams, thunkAPI) => {
    const response = await params.backendApi.fileTopicsApi.fileManagerTopicDelete(
      params.languageCode,
      params.file.id as string,
      params.topic.id as number
    )

    return thunkAPI.dispatch(contentTopics({ ...params }))
  }
)

export const contentFolderCreate: any = createAsyncThunk(
  'contentFolderCreate',
  async (params: ContentFolderCreateParams) => {
    return await params.backendApi.storageApi.fileManagerMkdir(params.languageCode, params.folder)
  }
)

export const contentSlice = createSlice({
  name: 'Content',
  initialState: {
    contents: new Content([]),
    filter: defaultContentFilter,
    isLoading: false,
    isUploading: false
  },
  reducers: {
    changeFilterBasePath(state, action: PayloadAction<string>) {
      state.filter.basePath = action.payload
    },
    changeFilterBasePathByFileId(state, action: PayloadAction<string>) {
      const file = state.contents.getById(action.payload)
      if (isDefined(file) && file.isDirectory) {
        state.filter.basePath = file?.absPath as string
      }
    },
    resetFilter(state) {
      state.filter = defaultContentFilter
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllContents.fulfilled, (state, action) => {
        const sortedData = action.payload.response.data.sort((a: FileEntry, b: FileEntry) => (b.isDirectory ? 1 : -1))
        state.contents.addFiles(sortedData)
        state.isLoading = false
      })
      .addCase(contentFolderCreate.fulfilled, (state, action) => {
        state.contents.addFile(action.payload.data)
        state.isLoading = false
      })
      .addCase(contentDelete.fulfilled, (state, action) => {
        state.contents.deleteById(action.payload.params.file.id as string)
        state.isLoading = false
      })
      .addCase(contentUpload.fulfilled, (state, action) => {
        state.isUploading = false
      })
      .addCase(contentDownload.fulfilled, (state, action) => {
        state.contents.updateFile(action.meta.arg.file.id, false, {})
      })
      .addCase(contentInfo.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(contentProductAssign.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(contentServiceAssign.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(contentLeadAssign.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addMatcher(isAnyOf(contentUpload.pending, contentUpload.rejected), state => {
        state.isUploading = true
      })
      .addMatcher(
        isAnyOf(
          getAllContents.pending,
          getAllContents.rejected,
          contentDelete.pending,
          contentDelete.rejected,
          contentFolderCreate.pending,
          contentFolderCreate.rejected,
          contentInfo.pending,
          contentInfo.rejected,
          contentProductAssign.pending,
          contentProductAssign.rejected,
          contentServiceAssign.pending,
          contentServiceAssign.rejected,
          contentLeadAssign.pending,
          contentLeadAssign.rejected
        ),
        state => {
          state.isLoading = true
        }
      )
      .addMatcher(isAnyOf(contentDownload.pending, contentDownload.rejected), (state, action) => {
        state.contents.updateFile(action.meta.arg.file.id, true, {})
      })
  }
})

export default contentSlice.reducer
