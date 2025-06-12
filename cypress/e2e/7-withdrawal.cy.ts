// Test E2E: Retiro de fondos (Withdraw Funds)

Cypress.on('uncaught:exception', () => false);

let email = '';

describe('Retiro de fondos', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Register');
    cy.wait(2000);
    cy.url().should('include', '/register');
    email = `testuser+${Date.now()}@mail.com`;
  });

  it('registra, loguea, carga saldo y retira fondos', () => {
    // Registro
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(email);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();
    cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
    cy.wait(2000);
    cy.url().should('include', '/login');

    // Login
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/wallet');

    // Cargar saldo primero (Request Debin)
    cy.get('[data-testid="request-debin-title"]').click();
    cy.get('[data-testid="request-debin-amount"]').type('100');
    cy.get('[data-testid="request-debin-account-number"]').type('account-1');
    cy.get('[data-testid="request-debin-description"]').type('Recarga test');
    cy.get('[data-testid="request-debin-submit"]').click();
    cy.wait(2000);
    cy.get('[data-testid="overview-title"]').click();
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('DEBIN_REQUEST', { timeout: 10000 }).should('be.visible');
    cy.contains('Balance:', { timeout: 10000 }).should('be.visible');
    cy.contains('$100.00', { timeout: 10000 }).should('be.visible');

    // Ir a Withdraw Funds
    cy.contains('Withdraw Funds').click();
    cy.get('[data-testid="addfunds-amount"]', { timeout: 10000 }).type('50');
    cy.get('[data-testid="addfunds-description"]', { timeout: 10000 }).type('Retiro test');
    cy.get('[data-testid="addfunds-submit"]', { timeout: 10000 }).click();
    cy.contains('Funds withdrawn successfully!', { timeout: 10000 }).should('be.visible');

    // Volver a overview y verificar balance y transacción
    cy.get('[data-testid="overview-title"]').click();
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 2);
    cy.contains('WITHDRAWAL', { timeout: 10000 }).should('be.visible');
    cy.contains('Balance:', { timeout: 10000 }).should('be.visible');
    cy.contains('$50.00', { timeout: 10000 }).should('be.visible');
  });

  it('valida campos requeridos y monto inválido', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/wallet');
    cy.contains('Withdraw Funds').click();

    // Campos requeridos
    cy.get('[data-testid="addfunds-submit"]', { timeout: 10000 }).click();
    cy.contains('Amount is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Description is required', { timeout: 10000 }).should('be.visible');

    // Monto inválido
    cy.get('[data-testid="addfunds-amount"]').type('0');
    cy.get('[data-testid="addfunds-description"]').type('Retiro test');
    cy.get('[data-testid="addfunds-submit"]', { timeout: 10000 }).click();
    cy.contains('Amount must be at least 0.01', { timeout: 10000 }).should('be.visible');
  });
}); 