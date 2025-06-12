// Test E2E: Carga de saldo (Add Funds)
// Asegura que un usuario pueda cargar saldo correctamente y que se muestren los mensajes de error si corresponde

Cypress.on('uncaught:exception', () => false);

describe('Carga de saldo', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');

    cy.document().its('readyState').should('eq', 'complete');
    cy.url().should('include', '/login');
    cy.get('body').should('contain.text', 'Login');

    cy.get('[data-testid="login-email"]').should('be.visible').type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="login-password"]').should('be.visible').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.contains('Login Successfully!', { timeout: 10000 }).should('exist');

    // Verificamos redirección a /wallet
    cy.url({ timeout: 10000 }).should('include', '/wallet');


    // Accedemos a la funcionalidad de "Add Funds"
    cy.contains('Add Funds', { timeout: 10000 }).should('be.visible').click();
  });

  it('permite cargar saldo correctamente', () => {
    cy.get('[data-testid="addfunds-amount"]').type('100');
    cy.get('[data-testid="addfunds-description"]').type('Recarga test');
    cy.get('[data-testid="addfunds-submit"]').click();

    cy.contains('Funds added successfully!', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="addfunds-amount"]').should('have.value', '');
    cy.get('[data-testid="addfunds-description"]').should('have.value', '');
  });
});