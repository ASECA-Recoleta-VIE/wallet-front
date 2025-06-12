// Test E2E: Transferencia de dinero entre usuarios con registro dinámico

Cypress.on('uncaught:exception', () => false);

let senderEmail = '';
let receiverEmail = '';

// Generar emails únicos para cada suite
before(() => {
  senderEmail = `sender+${Date.now()}@mail.com`;
  receiverEmail = `receiver+${Date.now()}@mail.com`;

  // Registrar el usuario receptor
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit('/register');
  cy.document().its('readyState').should('eq', 'complete');
  cy.get('body').should('contain.text', 'Register');
  cy.get('[data-testid="register-name"]').type('Receiver User');
  cy.get('[data-testid="register-email"]').type(receiverEmail);
  cy.get('[data-testid="register-password"]').type('Password1!');
  cy.get('[data-testid="register-confirm-password"]').type('Password1!');
  cy.get('[data-testid="register-submit"]').click();
  cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);

  // Registrar el usuario emisor
  cy.visit('/register');
  cy.get('body').should('contain.text', 'Register');
  cy.get('[data-testid="register-name"]').type('Sender User');
  cy.get('[data-testid="register-email"]').type(senderEmail);
  cy.get('[data-testid="register-password"]').type('Password1!');
  cy.get('[data-testid="register-confirm-password"]').type('Password1!');
  cy.get('[data-testid="register-submit"]').click();
  cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
  cy.wait(2000);

  // Cargar saldo al emisor
  cy.get('[data-testid="login-email"]').type(senderEmail);
  cy.get('[data-testid="login-password"]').type('Password1!');
  cy.get('[data-testid="login-submit"]').click();
  cy.url({ timeout: 10000 }).should('include', '/wallet');
  cy.get('[data-testid="request-debin-title"]').click();
  cy.get('[data-testid="request-debin-amount"]').type('100');
  cy.get('[data-testid="request-debin-account-number"]').type('account-1');
  cy.get('[data-testid="request-debin-description"]').type('Recarga test');
  cy.get('[data-testid="request-debin-submit"]').click();
  cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).click();
  cy.url().should('include', '/login');
});

describe('Transferencia de dinero', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).type(senderEmail);
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).type('Password1!');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/wallet');
    cy.contains('Transactions', { timeout: 10000 }).should('be.visible').click();
    cy.contains('New Transaction', { timeout: 10000 }).should('be.visible').click();
  });

  it('permite transferir dinero a otro usuario', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).type(receiverEmail);
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).type('10');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).type('Pago test');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('Transfer successful!', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="wallet-title"]').click();
    cy.get('[data-testid="overview-title"]').click();
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('TRANSFER_OUT', { timeout: 10000 }).should('be.visible');
    
  });

  it('receptor recibe el dinero', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type(receiverEmail);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait(2000);
    cy.get('[data-testid="wallet-title"]').click();
    cy.get('[data-testid="overview-title"]').click();
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('TRANSFER_IN', { timeout: 10000 }).should('be.visible');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('Recipient Email is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Amount is required', { timeout: 10000 }).should('be.visible');
  });

  it('valida monto inválido', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).type(receiverEmail);
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).type('0');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).type('Pago test');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('Please enter a valid amount', { timeout: 10000 }).should('be.visible');
  });

  it('valida monto negativo', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).type(receiverEmail);
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).type('-10');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).type('Pago test');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('Please enter a valid amount', { timeout: 10000 }).should('be.visible');
  });

  it('muestra error si el destinatario no existe', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).type('nonexistent@example.com');
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).type('10');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).type('Pago test');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('User not found: nonexistent@example.com', { timeout: 10000 }).should('be.visible');
  });

  it('muestra error si no hay saldo suficiente', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).type(receiverEmail);
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).type('100000000000');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).type('Pago test');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    cy.contains('Insufficient funds', { timeout: 10000 }).should('be.visible');
  });

  it('permite hacer logout correctamente', () => {
    cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).should('be.visible').click();
    cy.url().should('include', '/login');
    cy.contains('Log In', { timeout: 10000 }).should('be.visible');
  });
}); 