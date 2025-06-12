
// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  
  describe('Logout', () => {
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
    });
  
    it('permite hacer logout y redirige al login', () => {
      cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).should('exist').should('be.visible');
      cy.get('[data-testid="logout-btn"]', { timeout: 10000 }).click();
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist');
    });
  });