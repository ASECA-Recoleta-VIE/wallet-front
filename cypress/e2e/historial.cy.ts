// Test E2E: Visualización del historial de transacciones
// Asegura que el usuario pueda ver la tabla de historial y que haya al menos una transacción si existen datos

// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Historial de transacciones', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.wait(3000);
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).type('Password1!');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/wallet');
    cy.contains('Transactions', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('Transactions', { timeout: 10000 }).click();
  });

  it('muestra el historial de transacciones', () => {
    // Verificar que la tabla de transacciones existe
    cy.get('[data-testid="transactions-table"]', { timeout: 10000 }).should('exist').should('be.visible');
    
    // Verificar que hay al menos una transacción
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('muestra los detalles de una transacción', () => {
    // Hacer clic en la primera transacción
    cy.get('[data-testid="transaction-row"]', { timeout: 10000 }).should('exist').should('be.visible').first().click();
    
    // Verificar que se muestra el modal con los detalles
    cy.get('[data-testid="transaction-details-modal"]', { timeout: 10000 }).should('be.visible');
    
    // Verificar que los detalles contienen la información correcta
    cy.get('[data-testid="transaction-details-modal"]', { timeout: 10000 }).within(() => {
      cy.get('[data-testid="transaction-amount"]', { timeout: 10000 }).should('exist');
      cy.get('[data-testid="transaction-date"]', { timeout: 10000 }).should('exist');
      cy.get('[data-testid="transaction-description"]', { timeout: 10000 }).should('exist');
      cy.get('[data-testid="transaction-type"]', { timeout: 10000 }).should('exist');
    });
  });
}); 