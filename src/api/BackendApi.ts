import globalAxios, { AxiosInstance } from 'axios'
import {
  AssetApi,
  AssetDocumentsApi,
  AssetLeadApi,
  AssetTopicsApi,
  Configuration,
  DashboardApi,
  FileTopicsApi,
  GeneralApi,
  HealthApi,
  SettingsApi,
  StorageApi,
  LeadApi,
  LeadAssetsApi,
  LeadDocumentsApi,
  LeadPortalApi,
  LeadUserApi,
  TaxonomyApi,
  UserAuthenticationApi,
  UserCompanyDetailsApi,
  UserManagementApi,
  UserProfileDetailsApi,
  UserTaxonomyApi,
  UserVerificationApi,
  CompanyVocabularyApi,
  ServiceApi,
  ServiceDocumentsApi,
  ServiceLeadApi,
  ServiceTopicsApi,
  LeadServicesApi,
  UserLeadPortalApi,
  CompanyLeadPortalApi,
  CommonProcurementVocabularyApi,
  FeedbackApi,
  PublicApi,
  LeadStatusApi
} from 'src/generated-sources/swagger-api'
import { BASE_PATH, BaseAPI } from 'src/generated-sources/swagger-api/base'
import { BASE_PATH as MACHINE_LEARNING_BASE_PATH } from 'src/generated-sources/ml-api/base'
import { SearchApi } from 'src/generated-sources/search-api'
import { ExtractApi } from 'src/generated-sources/ml-api'

class BackendApi extends BaseAPI {
  public assetApi: AssetApi
  public assetDocumentsApi: AssetDocumentsApi
  public assetLeadApi: AssetLeadApi
  public assetTopicsApi: AssetTopicsApi
  public dashboardApi: DashboardApi
  public fileTopicsApi: FileTopicsApi
  public generalApi: GeneralApi
  public healthApi: HealthApi

  public serviceApi: ServiceApi
  public serviceDocumentsApi: ServiceDocumentsApi
  public serviceLeadApi: ServiceLeadApi
  public serviceTopicsApi: ServiceTopicsApi
  public settingsApi: SettingsApi
  public storageApi: StorageApi
  public leadApi: LeadApi
  public leadAssetsApi: LeadAssetsApi
  public leadServicesApi: LeadServicesApi
  public leadDocumentsApi: LeadDocumentsApi
  public leadPortalApi: LeadPortalApi
  public companyLeadPortalApi: CompanyLeadPortalApi
  public taxonomyApi: TaxonomyApi
  public userAuthenticationApi: UserAuthenticationApi
  public userVerificationApi: UserVerificationApi
  public userCompanyDetailsApi: UserCompanyDetailsApi
  public userLeadPortalApi: UserLeadPortalApi
  public userManagementApi: UserManagementApi
  public userProfileDetailsApi: UserProfileDetailsApi
  public userTaxonomyApi: UserTaxonomyApi
  public feedbackApi: FeedbackApi
  public publicApi: PublicApi

  public searchApi: SearchApi
  public companyVocabularyApi: CompanyVocabularyApi
  public commonProcurementVocabularyApi: CommonProcurementVocabularyApi

  public leadUserApi: LeadUserApi
  public leadStatusApi: LeadStatusApi

  public extractApi: ExtractApi

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected axios: AxiosInstance = globalAxios,
    protected machineLearningBasePath: string = MACHINE_LEARNING_BASE_PATH
  ) {
    super(configuration, basePath, axios)

    this.assetApi = new AssetApi(this.configuration, basePath, axios)
    this.assetDocumentsApi = new AssetDocumentsApi(this.configuration, basePath, axios)
    this.assetLeadApi = new AssetLeadApi(this.configuration, basePath, axios)
    this.assetTopicsApi = new AssetTopicsApi(this.configuration, basePath, axios)
    this.dashboardApi = new DashboardApi(this.configuration, basePath, axios)
    this.fileTopicsApi = new FileTopicsApi(this.configuration, basePath, axios)
    this.generalApi = new GeneralApi(this.configuration, basePath, axios)
    this.healthApi = new HealthApi(this.configuration, basePath, axios)
    this.publicApi = new PublicApi(this.configuration, basePath, axios)

    this.serviceApi = new ServiceApi(this.configuration, basePath, axios)
    this.serviceDocumentsApi = new ServiceDocumentsApi(this.configuration, basePath, axios)
    this.serviceLeadApi = new ServiceLeadApi(this.configuration, basePath, axios)
    this.serviceTopicsApi = new ServiceTopicsApi(this.configuration, basePath, axios)
    this.settingsApi = new SettingsApi(this.configuration, basePath, axios)
    this.storageApi = new StorageApi(this.configuration, basePath, axios)
    this.leadApi = new LeadApi(this.configuration, basePath, axios)
    this.leadAssetsApi = new LeadAssetsApi(this.configuration, basePath, axios)
    this.leadServicesApi = new LeadServicesApi(this.configuration, basePath, axios)
    this.leadDocumentsApi = new LeadDocumentsApi(this.configuration, basePath, axios)
    this.leadPortalApi = new LeadPortalApi(this.configuration, basePath, axios)
    this.companyLeadPortalApi = new CompanyLeadPortalApi(this.configuration, basePath, axios)
    this.taxonomyApi = new TaxonomyApi(configuration, basePath, axios)
    this.userAuthenticationApi = new UserAuthenticationApi(configuration, basePath, axios)
    this.userVerificationApi = new UserVerificationApi(configuration, basePath, axios)
    this.userCompanyDetailsApi = new UserCompanyDetailsApi(this.configuration, basePath, axios)
    this.userLeadPortalApi = new UserLeadPortalApi(this.configuration, basePath, axios)
    this.userManagementApi = new UserManagementApi(this.configuration, basePath, axios)
    this.commonProcurementVocabularyApi = new CommonProcurementVocabularyApi(this.configuration, basePath, axios)
    this.userProfileDetailsApi = new UserProfileDetailsApi(this.configuration, basePath, axios)
    this.userTaxonomyApi = new UserTaxonomyApi(this.configuration, basePath, axios)
    this.searchApi = new SearchApi(this.configuration, basePath, axios)
    this.companyVocabularyApi = new CompanyVocabularyApi(this.configuration, basePath, axios)
    this.leadUserApi = new LeadUserApi(this.configuration, basePath, axios)
    this.leadStatusApi = new LeadStatusApi(this.configuration, basePath, axios)
    this.feedbackApi = new FeedbackApi(this.configuration, basePath, axios)
    this.extractApi = new ExtractApi(this.configuration, machineLearningBasePath, axios)
  }
}

export default BackendApi
