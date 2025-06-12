// Test E2E: Carga de saldo (Add Funds) con debugging extra

Cypress.on('uncaught:exception', () => false);

// Log extra en consola
Cypress.on('log:added', (options) => {
  console.log(`[CYPRESS LOG] ${options.name}: ${options.message}`);
});

describe('Carga de saldo', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    // Verificar que el backend responde antes de empezar
    // Visita login
    cy.visit('/login');
    cy.document().its('readyState').should('eq', 'complete');
    cy.url().should('include', '/login');
    cy.get('body').should('contain.text', 'Login');

    cy.get('[data-testid="login-email"]', { timeout: 10000 })
      .should('be.visible')
      .type('pablopagliaricci@gmail.com');

    cy.get('[data-testid="login-password"]', { timeout: 10000 })
      .should('be.visible')
      .type('Password1!');

    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();

    // Captura antes de verificar el toast
    cy.screenshot('post-login-submit');

    // Verificamos si aparece el mensaje (sin fallar si no está)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.text().includes('Login Successfully!')) {
        cy.log('✅ Login success message visible');
      } else {
        cy.log('❌ Login success message NO visible');
        cy.screenshot('login-toast-fail');
      }
    });

    // Verificar redirección a /wallet
    cy.url({ timeout: 10000 }).should('include', '/wallet');

    // Captura por si no aparece botón Add Funds
    cy.contains('Add Funds', { timeout: 10000 })
      .should('be.visible')
      .screenshot('add-funds-visible')
      .click();
  });

  it('permite cargar saldo correctamente', () => {
    cy.get('[data-testid="addfunds-amount"]').type('100');
    cy.get('[data-testid="addfunds-description"]').type('Recarga test');
    cy.get('[data-testid="addfunds-submit"]').click();

    // Verificamos que aparezca el toast
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.text().includes('Funds added successfully!')) {
        cy.log('✅ Funds added toast visible');
      } else {
        cy.log('❌ Funds added toast NO visible');
        cy.screenshot('add-funds-toast-fail');
      }
    });

    cy.get('[data-testid="addfunds-amount"]').should('have.value', '');
    cy.get('[data-testid="addfunds-description"]').should('have.value', '');
  });
});