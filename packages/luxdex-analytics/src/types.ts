export interface ITraceContext {
  // Page identifier (e.g., 'swap-page', 'pool-page')
  page?: string
  // Section identifier (e.g., 'token-selector', 'swap-form')
  section?: string
  // Element identifier (e.g., 'token-input', 'submit-button')
  element?: string
  // Modal identifier if in a modal context
  modal?: string
}
