// Test E2E: Registro de usuario
// Asegura que un usuario pueda registrarse correctamente y que los mensajes de error se muestren si corresponde

describe('Registro de usuario', () => {
  it('permite registrar un usuario nuevo', () => {
    cy.visit('/register');
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(`testuser+${Date.now()}@mail.com`);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();
    cy.contains('Registro exitoso').should('exist');
    cy.url().should('include', '/login');
  });

  it('muestra error si las contraseñas no coinciden', () => {
    cy.visit('/register');
    cy.get('[data-testid="register-name"]').type('Test User');
    cy.get('[data-testid="register-email"]').type(`testuser2+${Date.now()}@mail.com`);
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password2!');
    cy.get('[data-testid="register-submit"]').click();
    cy.contains('Passwords do not match').should('be.visible');
  });
}); 