// Test E2E: Visualización del historial de transacciones con registro y request debin

Cypress.on('uncaught:exception', () => false);

let email = '';

describe('Historial de transacciones', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Register');
    cy.wait(3000);
    cy.url().should('include', '/register');
    email = `testuser+${Date.now()}@mail.com`;
  });

  it('registra, loguea, hace request debin y ve el historial', () => {
    // Registro
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(email);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();
    cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
    cy.wait(5000);
    cy.url().should('include', '/login');

    // Login
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/wallet');

    // Ir a la sección de transacciones
    cy.contains('No transactions found.', { timeout: 10000 }).should('be.visible');


    // Hacer un request debin
    cy.get('[data-testid="request-debin-title"]').click();
    cy.get('[data-testid="request-debin-amount"]').type('100');
    cy.get('[data-testid="request-debin-account-number"]').type('account-1');
    cy.get('[data-testid="request-debin-description"]').type('Recarga test');
    cy.get('[data-testid="request-debin-submit"]').click();

    // Verificar que aparece una row en el historial y la palabra DEBIN_REQUEST
    cy.get('[data-testid="overview-title"]').click();
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('DEBIN_REQUEST', { timeout: 10000 }).should('be.visible');
  });
}); 