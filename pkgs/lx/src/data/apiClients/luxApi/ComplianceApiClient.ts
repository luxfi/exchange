import { createComplianceApiClient } from '@luxexchange/api'
import { lxUrls } from 'lx/src/constants/urls'

export const ComplianceApiClient = createComplianceApiClient({
  baseUrl: lxUrls.complianceApiBaseUrl,
})
