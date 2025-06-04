// Test E2E: Logout del sistema
// Asegura que el usuario pueda desloguearse correctamente y sea redirigido al login

describe('Logout', () => {
  beforeEach(() => {
    // Asume que el usuario ya está logueado
    cy.visit('/wallet');
  });

  it('permite hacer logout y redirige al login', () => {
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-submit"]').should('exist');
  });
}); 