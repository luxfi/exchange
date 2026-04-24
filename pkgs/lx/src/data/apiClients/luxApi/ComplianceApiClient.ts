import { createComplianceApiClient } from '@l.x/api'
import { lxUrls } from '@l.x/lx/src/constants/urls'

export const ComplianceApiClient = createComplianceApiClient({
  baseUrl: lxUrls.complianceApiBaseUrl,
})
