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
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.wait(3000);
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pablopagliaricci@gmail.com');
    });
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Password1!');
    });
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/wallet');
    cy.contains('Transactions', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('Transactions', { timeout: 10000 }).click();
    cy.contains('New Transaction', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('New Transaction', { timeout: 10000 }).click();
  });

  it('permite transferir dinero a otro usuario', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pedropagliaricci@gmail.com');
    });
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('10');
    });
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pago test');
    });
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar toast de éxito
    cy.contains('Transfer successful!', { timeout: 10000 }).should('be.visible');
    // Verificar que los campos se limpian
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('have.value', '');
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('have.value', '');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar mensajes de error personalizados
    cy.contains('Recipient Email is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Amount is required', { timeout: 10000 }).should('be.visible');
  });

  it('valida monto inválido', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pedropagliaricci@gmail.com');
    });
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('0');
    });
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pago test');
    });
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar mensaje de error personalizado
    cy.contains('Please enter a valid amount', { timeout: 10000 }).should('be.visible');
  });

  it('valida monto negativo', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pedropagliaricci@gmail.com');
    });
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('-10');
    });
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pago test');
    });
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar mensaje de error personalizado
    cy.contains('Please enter a valid amount', { timeout: 10000 }).should('be.visible');
  });

  it('muestra error si el destinatario no existe', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('nonexistent@example.com');
    });
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('10');
    });
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pago test');
    });
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar toast de error
    cy.contains('User not found: nonexistent@example.com', { timeout: 10000 }).should('be.visible');
  });

  it('muestra error si no hay saldo suficiente', () => {
    cy.get('[data-testid="transfer-to-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pedropagliaricci@gmail.com');
    });
    cy.get('[data-testid="transfer-amount"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('100000000000');
    });
    cy.get('[data-testid="transfer-description"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pago test');
    });
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="transfer-submit"]', { timeout: 10000 }).click();
    // Verificar toast de error
    cy.contains('Insufficient funds', { timeout: 10000 }).should('be.visible');
  });

  it('permite hacer logout correctamente', () => {
    cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).click();
    cy.url().should('include', '/login');
    cy.contains('Log In', { timeout: 10000 }).should('be.visible');
  });
}); 