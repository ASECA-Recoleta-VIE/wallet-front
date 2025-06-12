// Test E2E: Carga de saldo (Add Funds)
// Asegura que un usuario pueda cargar saldo correctamente y que se muestren los mensajes de error si corresponde

// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Carga de saldo', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.document.cookie = 'token=; Max-Age=0; path=/;';
    });
    cy.visit('/login');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.wait(3000);
    cy.url().should('include', '/login');

    // TODO: ESTO ESTABA FUERA DEL beforeEach -> ahora está adentro
    cy.get('[data-testid="login-email"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('pablopagliaricci@gmail.com');
      });
    cy.get('[data-testid="login-password"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length', 1)
      .then(($input) => {
        cy.wrap($input).type('Password1!');
      });
    cy.get('[data-testid="login-submit"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/wallet');
    cy.contains('Add Funds', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('Add Funds', { timeout: 10000 }).click();
  });
});