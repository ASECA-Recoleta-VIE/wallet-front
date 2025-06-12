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
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(`testuser+${Date.now()}@mail.com`);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();
    
    // Verificar toast de éxito
    cy.contains('Registration successful!').should('be.visible');
    
    // Verificar redirección
    cy.url().should('include', '/login');
  });

  it('valida campos requeridos', () => {
    cy.get('[data-testid="register-submit"]').click();

    // Verificar mensajes de error personalizados
    cy.contains('Full Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.contains('Confirm Password is required').should('be.visible');
  });

  it('valida que las contraseñas coincidan', () => {
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type('test@example.com');
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password2!');
    cy.get('[data-testid="register-submit"]').click();

    // Verificar mensaje de error personalizado
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('permite mostrar/ocultar contraseñas', () => {
    // Verificar que las contraseñas están ocultas por defecto
    cy.get('[data-testid="register-password"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="register-confirm-password"]').should('have.attr', 'type', 'password');

    // Mostrar contraseña principal
    cy.get('[aria-label="Show password"]').first().click({ force: true });
    cy.get('[data-testid="register-password"]').should('have.attr', 'type', 'text');

    // Mostrar contraseña de confirmación
    cy.get('[aria-label="Show password"]').last().click();
    cy.get('[data-testid="register-confirm-password"]').should('have.attr', 'type', 'text');

    // Ocultar contraseñas
    cy.get('[aria-label="Hide password"]').first().click({ force: true });
    cy.get('[aria-label="Hide password"]').last().click();
    cy.get('[data-testid="register-password"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="register-confirm-password"]').should('have.attr', 'type', 'password');
  });
}); 