// Test E2E: Transferencia de dinero entre usuarios
// Asegura que un usuario pueda transferir dinero a otro y que se muestre el mensaje de éxito o error

// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  // Devuelve false para evitar que Cypress falle el test automáticamente
  return false;
});


describe('Transferencia de dinero', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/wallet');
    cy.contains('Transactions').click();
    cy.contains('New Transaction').click();
  });

  it('permite transferir dinero a otro usuario', () => {
    cy.get('[data-testid="transfer-to-email"]').type('pedropagliaricci@gmail.com');
    cy.get('[data-testid="transfer-amount"]').type('10');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.get('[data-testid="transfer-success"]').should('be.visible');
  });

  it('muestra error si falta el email del destinatario', () => {
    cy.get('[data-testid="transfer-amount"]').type('10');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.get('[data-testid="transfer-to-email"]').then(($input) => {
      expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
    });
  });
}); 