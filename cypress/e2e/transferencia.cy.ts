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
    
    // Verificar toast de éxito
    cy.contains('Transfer successful!').should('be.visible');
    
    // Verificar que los campos se limpian
    cy.get('[data-testid="transfer-to-email"]').should('have.value', '');
    cy.get('[data-testid="transfer-amount"]').should('have.value', '');
    cy.get('[data-testid="transfer-description"]').should('have.value', '');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="transfer-submit"]').click();

    // Verificar mensajes de error personalizados
    cy.contains('Recipient Email is required').should('be.visible');
    cy.contains('Amount is required').should('be.visible');
  });



  it('valida monto inválido', () => {
    cy.get('[data-testid="transfer-to-email"]').type('pedropagliaricci@gmail.com');
    cy.get('[data-testid="transfer-amount"]').type('0');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();

    // Verificar mensaje de error personalizado
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('valida monto negativo', () => {
    cy.get('[data-testid="transfer-to-email"]').type('pedropagliaricci@gmail.com');
    cy.get('[data-testid="transfer-amount"]').type('-10');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();

    // Verificar mensaje de error personalizado
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('muestra error si el destinatario no existe', () => {
    cy.get('[data-testid="transfer-to-email"]').type('nonexistent@example.com');
    cy.get('[data-testid="transfer-amount"]').type('10');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();
    
    // Verificar toast de error
    cy.contains('User not found: nonexistent@example.com').should('be.visible');
  });

  it('muestra error si no hay saldo suficiente', () => {
    cy.get('[data-testid="transfer-to-email"]').type('pedropagliaricci@gmail.com');
    cy.get('[data-testid="transfer-amount"]').type('100000000000');
    cy.get('[data-testid="transfer-description"]').type('Pago test');
    cy.get('[data-testid="transfer-submit"]').click();
    
    // Verificar toast de error
    cy.contains('Insufficient funds').should('be.visible');
  });

  it('permite hacer logout correctamente', () => {
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
    cy.contains('Log In').should('be.visible');
  });
}); 