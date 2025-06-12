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
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-email"]').type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/wallet');
    cy.contains('Transactions').click();
  });

  it('muestra el historial de transacciones', () => {
    // Verificar que la tabla de transacciones existe
    cy.get('[data-testid="transactions-table"]').should('exist');
    
    // Verificar que hay al menos una transacción
    cy.get('[data-testid="transaction-row"]').should('have.length.at.least', 1);
  });

  it('muestra los detalles de una transacción', () => {
    // Hacer clic en la primera transacción
    cy.get('[data-testid="transaction-row"]').first().click();
    
    // Verificar que se muestra el modal con los detalles
    cy.get('[data-testid="transaction-details-modal"]').should('be.visible');
    
    // Verificar que los detalles contienen la información correcta
    cy.get('[data-testid="transaction-details-modal"]').within(() => {
      cy.get('[data-testid="transaction-amount"]').should('exist');
      cy.get('[data-testid="transaction-date"]').should('exist');
      cy.get('[data-testid="transaction-description"]').should('exist');
      cy.get('[data-testid="transaction-type"]').should('exist');
    });
  });
}); 