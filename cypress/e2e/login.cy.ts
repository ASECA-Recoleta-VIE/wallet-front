// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Login de usuario', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register?testmode=true');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Register');
    cy.wait(3000);
    cy.url().should('include', '/register');
    cy.get('[data-testid="register-name"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Pablo Pagliaricci');
    });
    cy.get('[data-testid="register-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).clear().type('pablopagliaricci@gmail.com');
    });
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Password1!');
    });
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Password1!');
    });
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).click();
    cy.url().should('include', '/login');
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login?testmode=true');
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('body').should('contain.text', 'Login');
    cy.wait(3000);
    cy.url().should('include', '/login');
  });

  it('permite iniciar sesión correctamente con credenciales válidas', () => {
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('pablopagliaricci@gmail.com');
    });
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('Password1!');
    });
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.contains('Login successful!', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/wallet');
    cy.contains('Balance', { timeout: 10000 }).should('be.visible');
  });

  it('muestra error con credenciales inválidas', () => {
    cy.get('[data-testid="login-email"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('usuario@ejemplo.com');
    });
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.length', 1).then(($input) => {
      cy.wrap($input).type('password_incorrecto');
    });
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.contains('Invalid email or password', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="login-submit"]', { timeout: 10000 }).click();
    cy.contains('Email is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Password is required', { timeout: 10000 }).should('be.visible');
  });

  it('permite mostrar/ocultar contraseña', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.attr', 'type', 'password');
    cy.get('[aria-label="Show password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[aria-label="Show password"]', { timeout: 10000 }).click();
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('have.attr', 'type', 'text');
    cy.get('[aria-label="Hide password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[aria-label="Hide password"]', { timeout: 10000 }).click();
    cy.get('[data-testid="login-password"]', { timeout: 10000 }).should('have.attr', 'type', 'password');
  });
});