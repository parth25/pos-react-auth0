
import BackendApi from 'src/api/BackendApi'
import {
  Asset,
  AssetRow,
  AssignSource,
  AssignableAsset,
  AssignableLead,
  AssignableService,
  CommonProcurementVocabulary,
  CompanyCountry,
  CompanyDetails,
  CompanyLeadPortal,
  CompanyLeadStatus,
  Component,
  Country,
  CreateAsset,
  CreateDeletedNameEntity,
  CreateNamedEntitiesRequest,
  CreateService,
  Currency,
  DocumentType,
  ExporterType,
  FeedBack,
  FeedBackStatusRequest,
  FileEntry,
  FileInfo,
  Folder,
  IssueType,
  Language,
  Lead,
  LeadGetAllTaxonomyTypeEnum,
  LeadGetAllTypeEnum,
  LeadPortal,
  LeadPortalType,
  LeadPortalWithCredential,
  LeadStatusRequest,
  Portfolio,
  Service,
  ServiceRow,
  SettingsUserValues,
  Span,
  Status,
  Taxonomy,
  TaxonomyName,
  TaxonomyRow,
  Topic,
  TopicsResponse,
  UpdateAsset,
  UpdateService,
  UserChangePasswordRequest,
  UserInvitation,
  UserProfile,
  UserProfileDetails,
  UserProfileInfoUpdate,
  Word,
  TermPriority
} from 'src/generated-sources/swagger-api'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import React, { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import { SearchResponse } from 'src/generated-sources/search-api'
import { AuthConfigType } from 'src/configs/auth'
import i18n from 'i18next'
import { CompanyStatusEnum } from 'src/utils/enum'
import { TreeNode } from './apps/CheckboxTreeTypes'
import { ExtractNamedEntityRequest } from 'src/generated-sources/ml-api'

import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringEnum,
  useQueryStates
} from 'nuqs'
import { customParseAsArrayOf, parseAsDate } from 'src/utils/miscellaneous'

export type LeadsGraphOptions = 'LAST_7_DAYS' | 'LAST_14_DAYS' | 'LAST_30_DAYS' | 'LAST_3_MONTHS'

export type ContentPreviewProps = {
  backendApi: ApiContextType['backendApi']
  languageCode: string
  isShowed: boolean
  setIsShowed: Dispatch<SetStateAction<string>>
  file: FileEntry & any
  fetchDocumentTopicFn?: (
    languageCode: string,
    file: FileEntry,
    draw: number,
    page: number,
    pageSize: number,
    query?: string | undefined,
    options?: AxiosRequestConfig<any> | undefined
  ) => Promise<AxiosResponse<TopicsResponse, any>>
  deleteDocumentTopicFn?: (languageCode: string, file: FileEntry, topic: Topic) => Promise<AxiosResponse<void, any>>
  addDocumentTopicsFn?: (
    topics: Array<string>,
    file: FileEntry,
    draw: number,
    page: number,
    pageSize: number,
    query?: string
  ) => Promise<AxiosResponse<void, any>>
  fetchContentFn: (file: FileEntry) => Promise<Blob | null>
}

export interface CompanyRegisterFormType {
  taxNumber?: string | null
  companyName: string
  billingAddress?: string | null
  companyCity?: string | null
  companyState?: string | null
  companyZipcode?: string | null
  selectedCompanyCountries: CompanyCountry
  logo?: string
  baseUrls: string[]
}

export interface userRegisterFormType {
  userEmail: string
  userLastName: string
  userFirstName: string
  userPhone?: string
  defaultCountry?: CompanyCountry
}

export interface SearchDocumentPreviewProps {
  isShowed: boolean
  setIsShowed: (value: ((prevState: boolean) => boolean) | boolean) => void
  file: FileEntry & any
  fetchContentFunction: (file: FileEntry) => Promise<Blob | null>
  isFileLoading: boolean
}

export type AppConfig = {
  auth: AuthConfigType
  backend_base_url: string
  machine_learning_base_url: string
  randomString: string
  version: string
}

export interface ContentCardProps {
  backendApi: ApiContextType['backendApi']
  languageCode: string
  file: FileEntry & any
}

export interface FileIconProps {
  fontSize?: number
  file: ContentCardProps['file']
}

export interface ContentSidebarProps {
  hidden: boolean
  lgAbove: boolean
  leftSidebarDrawerOpen: boolean
  leftSidebarDrawerWidth: number
  handleLeftSidebarDrawerToggle: () => void
}

export interface ContentCardSectionProps {
  hidden: boolean
  lgAbove: boolean
  handleLeftSidebarDrawerToggle: () => void
}

export interface CreateFolderProps {
  backendApi: BackendApi
  languageCode: string
  openContentCreateFolderDialog: boolean
  handleContentCreateFolderClose: () => void
}

export interface ContentInfoProps {
  file: FileEntry & any
  isShowedInfo: boolean
  setIsShowedInfo: (value: ((prevState: boolean) => boolean) | boolean) => void
  contentInfoData: FileInfo & any
}

export interface ContentAssignLeadProps {
  backendApi: BackendApi
  languageCode: string
  file: FileEntry & any
  isShowedContentAssignLead: boolean
  setIsShowedContentAssignLead: (value: ((prevState: boolean) => boolean) | boolean) => void
}

export interface ContentAssignProductProps {
  backendApi: BackendApi
  languageCode: string
  file: FileEntry & any
  isShowedContentAssignProduct: boolean
  setIsShowedContentAssignProduct: (value: ((prevState: boolean) => boolean) | boolean) => void
  selectedCompanyCountry: CompanyCountry
}

export interface ContentAssignServiceProps {
  backendApi: BackendApi
  languageCode: string
  file: FileEntry & any
  isShowedContentAssignService: boolean
  setIsShowedContentAssignService: (value: ((prevState: boolean) => boolean) | boolean) => void
  selectedCompanyCountry: CompanyCountry
}

export interface RegisterStepProps {
  activeStep: number
  setActiveStep: (value: ((prevState: number) => number) | number) => void
}

export interface ResetPasswordProps {
  backendApi: BackendApi
  user: UserProfileDetails
  openDialog: boolean
  isLoading: boolean
  handleCloseDialog: () => void
}

export interface ChangeUserPasswordParams {
  backendApi: BackendApi
  userChangePasswordRequest: UserChangePasswordRequest
}

export interface ConfirmationDialogProps {
  isOpenDialog: boolean
  handleCloseDialog: () => void
  handleAcceptDialog: () => void
  handleRejectDialog: () => void
  dialogIcon: React.ReactNode
  mainHeading: string
  subHeading: string
  subHeadingName: string
  acceptButtonLabel: string
  rejectButtonLabel: string
  isAcceptButtonLoading: boolean
}

export interface GetUserSettingsPersonalParams extends DataParams {
  settingName: SettingsUserValues
}

export interface PutUserSettingsPersonalParams extends GetUserSettingsPersonalParams {
  settingValue: [key: string]
}

export interface PickerProps {
  label?: React.ReactNode
  end: Date | number | null
  start: Date | number | null
}

export interface CustomDateRangeInputProps extends PickerProps {
  language: string
}

export type DateType = Date | null | undefined

export interface LeadFilter {
  portals: Array<string>
  postalCodes: Array<ZipCodeData>
  withoutPostalCode: boolean
}

export interface SearchLeadFilter {
  publicationDate: PickerProps
  dueDate: PickerProps
  portals: Array<string>

  isLoading: boolean
}

export interface ContentFilter {
  basePath: string
}

export interface ProductFilter {
  withAssignedLeads: string
  taxonomyOption: 'USER_TAXONOMY' | 'ALL_TAXONOMY'
  minPrice: number
  maxPrice: number
}

export interface ServiceFilter {
  withAssignedLeads: string
  taxonomyOption: 'USER_TAXONOMY' | 'ALL_TAXONOMY'
}

export interface HandleRefresh {
  setRefresh: (value: ((prevState: boolean) => boolean) | boolean) => void
  func?: (...args: any[]) => Promise<any> | any
  funcArgs?: any[]
}

export type ApiContextType = {
  backendApi: BackendApi
}

export interface DataParams {
  backendApi: BackendApi
  languageCode: string
}

export interface UserProfileSaveParams extends DataParams, UserProfileInfoUpdate {}

export interface PutUserLeadPortalsParams extends DataParams {
  leadPortals: Array<LeadPortal>
}

export interface AddPortalCredentialsParams extends DataParams {
  leadPortalWithCredential: LeadPortalWithCredential
}
export interface UpdatePortalCredentialsParams extends DataParams {
  leadPortalWithCredential: LeadPortalWithCredential
}

export interface DeletePortalCredentialsParams extends DataParams {
  portalId: number
  portalType: string
}

export interface UserProfileUpdateCompanyParams extends DataParams {
  name?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  portalCountries?: Array<CompanyCountry>
  logo?: File
  faviconIcon?: File
  taxNumber?: string
  billingAddress?: string
  commonProcurementVocabulary?: Array<CommonProcurementVocabulary>
  currency?: Currency
  termPriority?: TermPriority
}

export interface CompanyCreateParams extends DataParams {
  name: string
  portalCountries: Array<CompanyCountry>
  city?: string
  state?: string
  country?: string
  postalCode?: string
  logo?: File
  faviconIcon?: File
  taxNumber?: string
  billingAddress?: string
  currency?: Currency
}

export interface UserProfileUpdateParams {
  profile: UserProfileSaveParams
  company: UserProfileUpdateCompanyParams
}

export interface PostInviteUserParams extends DataParams {
  userInvitation: UserInvitation
}

export interface DeleteUserParams extends DataParams {
  email: string
}

export interface SearchResultTabsProps {
  backendApi: ApiContextType['backendApi']
  query?: string
}

export type ExtraSearchParams = {
  query?: string
  page: number
  rowsPerPage: number
  isLoading: boolean
  sort?: string[]
}

export interface SearchResultTabsEventState {
  activeTab: string
  leads: SearchResponse & ExtraSearchParams
  products: SearchResponse & ExtraSearchParams
  services: SearchResponse & ExtraSearchParams
  documents: SearchResponse & ExtraSearchParams
}

export interface TaxonomyEventState {
  query: string
  originalTaxonomyTree: Array<TreeNode>
  userSelectedTreeNodes: Array<string>
  filteredTaxonomyTree?: Array<TreeNode>
}

export interface CompanyLeadStatusEventState {
  query: string
  originalCompanyLeadStatusTree: Array<CompanyLeadStatus>
  filteredCompanyLeadStatusTree?: Array<CompanyLeadStatus>
}

export interface CpvEventState {
  query: string
  originalCpvTree: Array<TreeNode>
  userSelectedTreeNodes: Array<string>
  filteredCpvTree?: Array<TreeNode>
}

export interface SearchTabProps extends SearchResultTabsProps {
  event: SearchResultTabsEventState
  updateEvent: Dispatch<Partial<SearchResultTabsEventState>>
  isScreenSmall: boolean
}

export interface UserAccountProfileProps extends UserProfileDetails {
  isLoading: boolean
  companyPortalCountry: Array<CompanyCountry>
}

export interface CpvUserSettingProps {
  companyData: CompanyDetails
  isLoading: boolean
}

export interface CompanyAccountProfileProps {
  isLoading: boolean
  id: number
  name?: string
  faviconIcon?: string
  country?: string
  city?: string | null
  postalCode?: string | null
  state?: string | null
  billingAddress?: string | null
  leadStatuses: Array<CompanyLeadStatus>
  portalCountries?: Array<CompanyCountry>
  taxNumber?: string | null
  currency?: Currency
  termPriority?: TermPriority
}

export interface GetAllLeadParams extends DataParams {
  draw: number
  page: number
  pageSize: number
  type: LeadGetAllTypeEnum
  status: Array<string>
  startDueDate?: string
  endDueDate?: string
  withRecognizedTerms?: boolean
  startPublicationDate?: string
  endPublicationDate?: string
  query?: string
  portals?: Array<string>
  postalCodes?: Array<string>
  withoutPostalCode?: boolean
  includeArchived?: boolean
  includeLeadWinners?: boolean
  taxonomyType?: LeadGetAllTaxonomyTypeEnum
  portfolio?: Array<Portfolio>
}

export interface GetAllProductsParams extends DataParams {
  draw: number
  page: number
  pageSize: number
  categories: Array<string>
  query?: string
  withAssignedLeads?: boolean
  minPrice?: number
  maxPrice?: number
}

export interface GetAllServicesParams extends DataParams {
  draw: number
  page: number
  pageSize: number
  categories: Array<string>
  query?: string
  withAssignedLeads?: boolean
}

export interface LeadStatusParams extends DataParams {
  lead: Lead
  updatedStatus: CompanyLeadStatus
}

export interface RejectLeadStatusParams extends GetAllLeadParams {
  lead: Lead
}

export interface LeadNoteUpdateParams extends DataParams {
  lead: Lead
  note: string
}

export interface LeadInsertNamedEntitiesParams extends DataParams, CreateNamedEntitiesRequest {
  lead: Lead
}

export interface LeadDeleteNamedEntityParams extends DataParams {
  lead: Lead
  removedSpans: Array<Span>
}

export interface LeadDeleteAssignedProduct extends GetAllAssignedProductsOrServices {
  asset: Asset
}

export interface LeadDeleteAssignedService extends GetAllAssignedProductsOrServices {
  service: Service
}

export interface LeadAssignAssetSubmit extends GetAllAssignedProductsOrServices {
  asset: Asset
  assetId: string
  source: AssignSource
  score: number
}

export interface LeadAssignServiceSubmit extends GetAllAssignedProductsOrServices {
  service: Service
  serviceId: string
  source: AssignSource
  score: number
}

export interface LeadDeleteOrDissociateAssignedDocument extends GetAllAssignedDocuments {
  file: FileEntry
}

export interface LeadAcceptOrRejectAssignedProduct extends DataParams {
  asset: Asset
  lead: Lead
  draw: number
  confirmedProductsPage: number
  suggestedProductsPage: number
  confirmedProductsRowsPerPage: number
  suggestedProductsRowsPerPage: number
  isConfirmed: boolean
}
export interface LeadAcceptOrRejectAssignedService extends DataParams {
  service: Service
  lead: Lead
  draw: number
  confirmedServicesPage: number
  suggestedServicesPage: number
  confirmedServicesRowsPerPage: number
  suggestedServicesRowsPerPage: number
  isConfirmed: boolean
}

export interface GetAllAssignedProductsOrServices extends DataParams {
  lead: Lead
  draw: number
  page: number
  pageSize: number
  isConfirmed?: boolean
  termsSensitivityStart?: number
  termsSensitivityEnd?: number
  topicsSensitivityStart?: number
  topicsSensitivityEnd?: number
  query?: string
}

export interface GetAllAssignedDocuments extends DataParams {
  lead: Lead
  draw: number
  page: number
  pageSize: number
  documentType: DocumentType
  query?: string
}

export interface GetAllAssignedDocumentsTopicsParams extends DataParams {
  lead: Lead
  draw: number
  page: number
  pageSize: number
  query?: string
}

export interface GetAllDocumentsParams extends DataParams {
  basePath: string
}

export interface ContentUploadParams extends GetAllDocumentsParams {
  file: File
  leads: Array<AssignableLead>
  assets: Array<AssignableAsset>
  services: Array<AssignableService>
  documentType: DocumentType
  process: boolean
  name?: string
  overwrite?: boolean
  options?: AxiosRequestConfig
}

export interface ContentDeleteParams extends DataParams {
  file: FileEntry
}

export interface AddProductParams extends DataParams {
  asset: CreateAsset
}

export interface AddServiceParams extends DataParams {
  service: CreateService
}

export interface EditProductParams extends DataParams {
  asset: Asset
  updateAsset: UpdateAsset
}

export interface EditServiceParams extends DataParams {
  service: Service
  updateService: UpdateService
}

export interface DeleteProductParams extends DataParams {
  assetId: string
}

export interface DeleteServiceParams extends DataParams {
  serviceId: string
}

export interface ContentFolderCreateParams extends DataParams {
  folder: Folder
}

export interface ContentDownloadParams extends DataParams {
  file: FileEntry
  options?: AxiosRequestConfig
}

export interface ContentTopicsParams extends DataParams {
  file: FileEntry
  draw: number
  page: number
  pageSize: number
  query?: string
}

export interface ContentInfoParams extends DataParams {
  file: FileEntry
}

export interface ContentProductAssignParams extends ApiContextType {
  file: FileEntry
  product: Asset
}

export interface ContentServiceAssignParams extends ApiContextType {
  file: FileEntry
  service: Service
}

export interface ContentLeadAssignParams extends ApiContextType {
  file: FileEntry
  lead: Lead
}

export interface GetCompanyVocabularyParams extends DataParams {
  country: Country
  language: Language
}

export type SendFeedbackParams = DataParams & {
  images: Array<File>
  text: string
  status: Status
  component: Component
  issueType: IssueType
  metaData?: object
}

export interface RemoveDeletedSpanTextParams extends DataParams {
  id: number
}

export interface CompanyVocabularyAddParams extends DataParams {
  keywords: Array<Word>
}
export interface AddRemovedTermsParams extends DataParams {
  text: Array<CreateDeletedNameEntity>
}
export interface VocabularyWordUpdateParams extends DataParams {
  wordId: number
  keywords: Word
}

export interface VocabularyWordDeleteParams extends DataParams {
  wordId: number
}

export interface GetAllTaxonomyParams extends DataParams {
  country: Country
}

export interface SaveTaxonomyParams extends DataParams {
  country: Country
  taxonomyTreeNodes: Array<Taxonomy>
}

export interface CsvTaxonomyFileUploadParams extends DataParams {
  country: Country
  taxonomyRow: Array<TaxonomyRow>
  options?: AxiosRequestConfig
}

export interface CsvTaxonomyFileDownloadParams extends DataParams {
  country: Country
  exporterType: ExporterType
  options?: AxiosRequestConfig
}

export interface CsvProductFileDownloadParams extends DataParams {
  country: Country
  exporterType: ExporterType
  totalRecords?: number
  options?: AxiosRequestConfig
}

export interface CsvProductFileUploadParams extends GetAllProductsParams {
  country: Country
  assetRow: Array<AssetRow>
  options?: AxiosRequestConfig
}

export interface CsvServicesFileDownloadParams extends DataParams {
  country: Country
  exporterType: ExporterType
  totalRecords?: number
  options?: AxiosRequestConfig
}

export interface CsvServicesFileUploadParams extends GetAllServicesParams {
  country: Country
  serviceRow: Array<ServiceRow>
  options?: AxiosRequestConfig
}

export interface AddTaxonomyParams extends DataParams {
  taxonomy: Taxonomy
}

export interface EditTaxonomyParams extends DataParams {
  taxonomy: TreeNode
  updatedTaxonomy: TaxonomyName
}

export interface DeleteTaxonomyParams extends DataParams {
  taxonomyIds: Array<string>
}

export interface CreateTaxonomyProps {
  backendApi: BackendApi
  i18n: typeof i18n
  selectedUserCountry: CompanyCountry
  openAddTaxonomyDialog: boolean
  handleAddTaxonomyClose: () => void
}

export type AddPortalCredentialsProps = {
  backendApi: BackendApi
  i18n: typeof i18n
  openAddCredentialsDialog: boolean
  handleCredentialsAddDialogClose: () => void
  leadPortalType: LeadPortalType
  portalType: string
}

export type UpdatePortalCredentialsProps = {
  backendApi: BackendApi
  i18n: typeof i18n
  openUpdateCredentialsDialog: boolean
  handleCredentialsUpdateDialogClose: () => void
  updateCredentialsNode: CompanyLeadPortal
  title: React.ReactNode
  submitButtonText: React.ReactNode
  loadingSubmitButtonText: React.ReactNode
  isUpdatePortalCredentialsDialog: boolean
}

export interface UpdateTaxonomyProps {
  isShowedUpdateDialog: boolean
  setIsShowedUpdateDialog: (value: ((prevState: boolean) => boolean) | boolean) => void
  taxonomyNode: TreeNode
  onHandleEdit: (node: TreeNode, updatedTaxonomyName: string) => void // Update the prop type
}

export interface ContentUploaderProps extends DataParams {
  title: React.ReactNode
  basePath: string
  isShowed: boolean
  setIsShowed: (value: ((prevState: boolean) => boolean) | boolean) => void
  leads?: Array<Lead>
  selectedLeads?: Array<Lead>
  products?: Array<Asset>
  selectedProducts?: Array<Asset>
  services?: Array<Service>
  selectedServices?: Array<Service>
  selectedCompanyCountry?: CompanyCountry
}

export interface PortalRenderTreeView {
  companyLeadPortals: CompanyLeadPortal[]
  checkedPortal: LeadPortal[]
  setCheckedPortal: Dispatch<SetStateAction<LeadPortal[]>>
}

export interface GetAllAssetTopicsParams extends DataParams {
  asset: Asset
  draw: number
  page: number
  pageSize: number
  query?: string
}

export interface GetAllServiceTopicsParams extends DataParams {
  service: Service
  draw: number
  page: number
  pageSize: number
  query?: string
}

export interface AssetInsertTopicsParams extends GetAllAssetTopicsParams {
  topic: Array<Topic>
}

export interface ServiceInsertTopicsParams extends GetAllServiceTopicsParams {
  topic: Array<Topic>
}

export interface AssetDeleteTopicsParams extends GetAllAssetTopicsParams {
  topic: Topic
}

export interface ServiceDeleteTopicsParams extends GetAllServiceTopicsParams {
  topic: Topic
}

export interface ContentInsertTopicsParams extends ContentTopicsParams {
  topics: Array<Topic>
}

export interface ContentDeleteTopicParams extends ContentTopicsParams {
  topic: Topic
}

export interface LeadDeleteTopicOrDocumentTopicParams extends ContentDeleteTopicParams {
  lead: Lead
}

export interface LeadDocumentDownloadParams extends ContentDeleteTopicParams {
  lead: Lead
  file: FileEntry
  options?: AxiosRequestConfig
}
export interface AssetDocumentDownloadParams extends ContentDeleteTopicParams {
  asset: Asset
  file: FileEntry
  options?: AxiosRequestConfig
}
export interface ServiceDocumentDownloadParams extends ContentDeleteTopicParams {
  service: Service
  file: FileEntry
}

export interface LeadDocumentTopicsParams extends ContentTopicsParams {
  lead: Lead
}

export interface LeadInsertTopicsDocumentParams extends ContentInsertTopicsParams {
  lead: Lead
}

export interface ProductAcceptOrRejectAssignedLead extends DataParams {
  asset: Asset
  lead: Lead
  draw: number
  leadsTypeConfirmed: string
  leadsTypeSuggested: string
  confirmedLeadsPage: number
  confirmedLeadsRowsPerPage: number
  suggestedLeadsPage: number
  suggestedLeadsRowsPerPage: number
}

export interface ServiceAcceptOrRejectAssignedLeadParams extends DataParams {
  service: Service
  lead: Lead
  draw: number
  leadsTypeConfirmed: string
  leadsTypeSuggested: string
  confirmedLeadsPage: number
  confirmedLeadsRowsPerPage: number
  suggestedLeadsPage: number
  suggestedLeadsRowsPerPage: number
}

export interface GetAllAssetAssignedDocuments extends DataParams {
  asset: Asset
  draw: number
  page: number
  pageSize: number
  documentType: DocumentType
  query?: string
}

export interface GetAllServiceAssignedDocuments extends DataParams {
  service: Service
  draw: number
  page: number
  pageSize: number
  documentType: DocumentType
  query?: string
}

export interface LeadSidebarProps {
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
  setFilter: ReturnType<typeof useQueryStates<LeadFilterType>>[1]
  hidden: boolean
  lgAbove: boolean
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  handleLeftSidebarToggle: () => void
}

export const createLeadFilterType = (companyLeadStatuses?: string[]) => ({
  page: parseAsInteger.withDefault(1),
  itemsPerPage: parseAsNumberLiteral([10, 25, 50]).withDefault(10),
  query: parseAsString.withDefault(''),
  leadType: parseAsStringEnum(Object.values(LeadGetAllTypeEnum)).withDefault(LeadGetAllTypeEnum.SuggestedLeads),
  leadStatus: customParseAsArrayOf(parseAsString).withDefault(
    companyLeadStatuses || [CompanyStatusEnum.Pending, CompanyStatusEnum.Confirmed, CompanyStatusEnum.Qualified]
  ),
  publicationStart: parseAsDate,
  publicationEnd: parseAsDate,
  dueStart: parseAsDate,
  dueEnd: parseAsDate,
  ttStart: parseAsFloat.withDefault(0.0),
  ttEnd: parseAsFloat.withDefault(1.0),
  tpStart: parseAsFloat.withDefault(0.0),
  tpEnd: parseAsFloat.withDefault(1.0),
  withRecognizedTerms: parseAsBoolean.withDefault(true),
  includeArchived: parseAsBoolean.withDefault(false),
  includeLeadWinners: parseAsBoolean.withDefault(false)
})

export type LeadFilterType = ReturnType<typeof createLeadFilterType>

export interface LeadCardContentProps {
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
  setFilter: ReturnType<typeof useQueryStates<LeadFilterType>>[1]
  hidden: boolean
  lgAbove: boolean
  smBelow: boolean
  handleLeftSidebarToggle: () => void
}

export interface LeadCardSearchBarProps {
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
  setFilter: ReturnType<typeof useQueryStates<LeadFilterType>>[1]
  lgAbove: boolean
  smBelow: boolean
  handleLeftSidebarToggle: () => void
}

export interface ProductSidebarProps {
  hidden: boolean
  lgAbove: boolean
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  handleLeftSidebarToggle: () => void
  userProfile: UserProfileDetails
  selectedCompanyCountry: CompanyCountry
}

export interface ServiceSidebarProps {
  hidden: boolean
  lgAbove: boolean
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  handleLeftSidebarToggle: () => void
  userProfile: UserProfileDetails
  selectedCompanyCountry: CompanyCountry
}

export interface ProductCardContentProps {
  hidden: boolean
  lgAbove: boolean
  smBelow: boolean
  handleLeftSidebarToggle: () => void
  selectedCompanyCountry: CompanyCountry
}

export interface ServiceCardContentProps {
  hidden: boolean
  lgAbove: boolean
  smBelow: boolean
  handleLeftSidebarToggle: () => void
  selectedCompanyCountry: CompanyCountry
}

export interface LeadCardProps {
  lead: Lead & any
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
}

export interface LeadTabsProps {
  lead: Lead & any
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
}

export interface LeadTabItemProps {
  lead: Lead & any
  isActive: boolean
  filters: ReturnType<typeof useQueryStates<LeadFilterType>>[0]
  selectedCompanyCountry?: CompanyCountry
}

export interface ProductCardProps {
  asset: Asset & any
  selectedCompanyCountry: CompanyCountry
  fetchProductData: () => void
}

export interface ServiceCardProps {
  service: Service & any
  selectedCompanyCountry: CompanyCountry
  fetchServiceData: () => void
}

export interface ProductTabsProps {
  asset: Asset & any
  selectedCompanyCountry: CompanyCountry
}

export interface ServiceTabsProps {
  service: Service & any
  selectedCompanyCountry: CompanyCountry
}

export interface ProductTabItemProps {
  asset: Asset & any
  isActive: boolean
  selectedCompanyCountry: CompanyCountry
}

export interface ServiceTabItemProps {
  service: Service & any
  isActive: boolean
  selectedCompanyCountry: CompanyCountry
}

export interface LeadAndProductTabPanelProps {
  children?: React.ReactNode
  tabId: string
  value: string | boolean
}

export interface LeadAndServiceTabPanelProps {
  children?: React.ReactNode
  tabId: string
  value: string | boolean
}

export interface ActionButtonWithTimeoutProps {
  mainComponent: (handleClick: () => void) => ReactElement
  timeoutComponent: (remainingTime: number) => React.ReactNode
  timeout: number
  onButtonClick?: () => void
}

export type InitializeCheckerProps = {
  children: ReactNode
}

export interface GetAssignUserListParams extends DataParams {
  query?: string
}

export interface PostAssignUserToLeadParams extends DataParams {
  user: UserProfile | UserProfileDetails
  lead: Lead
}

export interface DeleteAssignedUserFromLeadParams extends DataParams {
  user: UserProfile | UserProfileDetails
  lead: Lead
}

export interface GetExtractNamedEntityParams extends DataParams {
  companyId: number
  extractNamedEntityRequest: ExtractNamedEntityRequest
  language: Language
}

export interface AddProductProps extends DataParams {
  selectedUserCountry: CompanyCountry
  openAddProductDialog: boolean
  handleAddProductClose: () => void
  fetchProductData: () => void
}

export interface AddServiceProps extends DataParams {
  selectedUserCountry: CompanyCountry
  openAddServiceDialog: boolean
  handleAddServiceClose: () => void
  fetchServiceData: () => void
}

export interface AddServiceProps extends DataParams {
  selectedUserCountry: CompanyCountry
  openAddServiceDialog: boolean
  handleAddServiceClose: () => void
  fetchServiceData: () => void
}

export interface EditProductProps extends DataParams {
  selectedUserCountry: CompanyCountry
  openEditProductDialog: boolean
  handleEditProductClose: () => void
  asset: Asset & any
}

export interface EditServiceProps extends DataParams {
  selectedUserCountry: CompanyCountry
  openEditServiceDialog: boolean
  handleEditServiceClose: () => void
  service: Service & any
}

export type FeedbackStatusChangeParams = DataParams & {
  feedbackId: number
  feedBackStatusRequest: FeedBackStatusRequest
}

export type EditZipCodeDialogProps = {
  openEditPostalCodeDialog: boolean
  handleEditPostalCodeClose: (value?: ((prevState: boolean) => boolean) | boolean) => void
  editZipCode: ZipCodeData
}

export type AddZipCodeDialogProps = {
  openAddPostalCodeDialog: boolean
  handleAddPostalCodeClose: (value?: ((prevState: boolean) => boolean) | boolean) => void
}

export type ZipCodeData = {
  id: number
  isRange: boolean
  from?: string
  to: string
  country: CompanyCountry
}

export type ModifiedFeedback = FeedBack & {
  isLoading: boolean
}

export type FeedbackCardProps = {
  feedbackData: ModifiedFeedback
  index: number
  setOpenImagePreviewDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedImagePreview: React.Dispatch<React.SetStateAction<string[]>> // Modify 'any' to the appropriate type
  setInitialSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>
}

export interface ImagePreviewDialogProps {
  selectedImagePreview: []
  openImagePreviewDialog: boolean
  initialSelectedImageIndex: number
  handleImagePreviewDialog: () => void
}

export type WalkTourStep = {
  step: any
  url: string
}

export type CompanyInviteUserDrawerProps = {
  isDrawerOpen: boolean
  handleDrawerClose: () => void
  isLoading: boolean
}

export type LeadStatusAddParams = DataParams & {
  leadStatus: Array<LeadStatusRequest>
}

export type LeadStatusDeleteParams = DataParams & {
  leadStatus: CompanyLeadStatus
}

export type AddLeadStatusDialogProps = {
  openAddLeadStatusDialog: boolean
  handleAddLeadStatusDialogClose: (value?: ((prevState: boolean) => boolean) | boolean) => void
}
