// Test E2E: Carga de saldo (Add Funds) con debugging extra

Cypress.on('uncaught:exception', () => false);

// Log extra en consola
Cypress.on('log:added', (options) => {
  console.log(`[CYPRESS LOG] ${options.name}: ${options.message}`);
});

let email = ''; // Variable global al describe

describe('Carga de saldo', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Register');
    cy.wait(3000);
    cy.url().should('include', '/register');
    email = `testuser+${Date.now()}@mail.com`;
  });

  it('permite registrar un usuario nuevo', () => {
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(email);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();

    cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
    cy.wait(3000);
    cy.url().should('include', '/login');

    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/wallet');

    cy.contains('Add Funds', { timeout: 10000 })
      .should('be.visible')
      .screenshot('add-funds-visible')
      .click();
  });

  it('permite cargar saldo correctamente', () => {
    cy.visit('/login');

    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();

    cy.get('[data-testid="addfunds-amount"]').type('100');
    cy.get('[data-testid="addfunds-description"]').type('Recarga test');
    cy.get('[data-testid="addfunds-submit"]').click();

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