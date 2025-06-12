// Test E2E: Registro de usuario
// Asegura que un usuario pueda registrarse correctamente y que los mensajes de error se muestren si corresponde

// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Registro de usuario', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register');
    cy.url().should('include', '/register');
  });

  it('permite registrar un usuario nuevo', () => {
    cy.get('[data-testid="register-name"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-name"]', { timeout: 10000 }).type('Test User');
    cy.get('[data-testid="register-email"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-email"]', { timeout: 10000 }).type(`testuser+${Date.now()}@mail.com`);
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).type('Password1!');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).type('Password1!');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).click();
    // Verificar toast de éxito
    cy.contains('Registration successful!', { timeout: 10000 }).should('be.visible');
    // Verificar redirección
    cy.url().should('include', '/login');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).click();
    // Verificar mensajes de error personalizados
    cy.contains('Full Name is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Email is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Password is required', { timeout: 10000 }).should('be.visible');
    cy.contains('Confirm Password is required', { timeout: 10000 }).should('be.visible');
  });

  it('valida que las contraseñas coincidan', () => {
    cy.get('[data-testid="register-name"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-name"]', { timeout: 10000 }).type('Test User');
    cy.get('[data-testid="register-email"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-email"]', { timeout: 10000 }).type('test@example.com');
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).type('Password1!');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).type('Password2!');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="register-submit"]', { timeout: 10000 }).click();
    // Verificar mensaje de error personalizado
    cy.contains('Passwords do not match', { timeout: 10000 }).should('be.visible');
  });

  it('permite mostrar/ocultar contraseñas', () => {
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.attr', 'type', 'password');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('exist').should('be.visible').should('have.attr', 'type', 'password');
    cy.get('[aria-label="Show password"]', { timeout: 10000 }).first().should('exist').should('be.visible').click({ force: true });
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('have.attr', 'type', 'text');
    cy.get('[aria-label="Show password"]', { timeout: 10000 }).last().should('exist').should('be.visible').click();
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('have.attr', 'type', 'text');
    cy.get('[aria-label="Hide password"]', { timeout: 10000 }).first().should('exist').should('be.visible').click({ force: true });
    cy.get('[aria-label="Hide password"]', { timeout: 10000 }).last().should('exist').should('be.visible').click();
    cy.get('[data-testid="register-password"]', { timeout: 10000 }).should('have.attr', 'type', 'password');
    cy.get('[data-testid="register-confirm-password"]', { timeout: 10000 }).should('have.attr', 'type', 'password');
  });
});
