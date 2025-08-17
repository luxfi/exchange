// Custom Cypress commands

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('dataTestId', (value) => {
  return cy.get(`[data-testid=${value}]`)
})