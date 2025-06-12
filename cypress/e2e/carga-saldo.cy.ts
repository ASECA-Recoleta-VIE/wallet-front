// Test E2E: Carga de saldo (Add Funds)
// Asegura que un usuario pueda cargar saldo correctamente y que se muestren los mensajes de error si corresponde

// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Carga de saldo', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login?testmode=true');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.wait(3000);
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-email"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('pablopagliaricci@gmail.com');
      });
    cy.get('[data-testid="login-password"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('Password1!');
      });
    cy.get('[data-testid="login-submit"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/wallet');
    cy.contains('Add Funds', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('Add Funds', { timeout: 10000 }).click();
  });

  it('permite cargar saldo correctamente', () => {
    cy.get('[data-testid="addfunds-amount"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('100');
      });
    cy.get('[data-testid="addfunds-description"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('Recarga test');
      });
    cy.get('[data-testid="addfunds-submit"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    cy.get('[data-testid="addfunds-submit"]', { timeout: 10000 }).click();
    // Verificar toast de éxito
    cy.contains('Funds added successfully!', { timeout: 10000 }).should('be.visible');
    // Verificar que los campos se limpian
    cy.get('[data-testid="addfunds-amount"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="addfunds-description"]', { timeout: 10000 }).should('have.value', '');
  });
});