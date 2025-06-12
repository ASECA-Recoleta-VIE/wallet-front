// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  
  describe('Logout', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/login');
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-email"]').type('pablopagliaricci@gmail.com');
      cy.get('[data-testid="login-password"]').type('Password1!');
      cy.get('[data-testid="login-submit"]').click();
      cy.url().should('include', '/wallet');
    });
  
    it('permite hacer logout y redirige al login', () => {
      cy.get('[data-testid="logout-btn"]').click();
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-submit"]').should('exist');
    });
  });