// Test E2E: Carga de saldo (Add Funds)
// Asegura que un usuario pueda cargar saldo correctamente y que se muestren los mensajes de error si corresponde

describe('Carga de saldo', () => {
  beforeEach(() => {
    // Login y navegación robusta usando la UI
    cy.visit('/login');
    cy.get('#email').type('pablopagliaricci@gmail.com');
    cy.get('#password').type('Password1!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/wallet');
    cy.contains('Add Funds').click(); // Navega usando la UI
  });

  it('permite cargar saldo correctamente', () => {
    cy.get('[data-testid="addfunds-amount"]').type('100');
    cy.get('[data-testid="addfunds-description"]').type('Recarga test');
    cy.get('[data-testid="addfunds-submit"]').click();
    cy.contains('Funds added successfully').should('be.visible');
  });

  it('muestra error si el monto es inválido', () => {
    cy.get('[data-testid="addfunds-amount"]').type('0');
    cy.get('[data-testid="addfunds-description"]').type('Recarga test');
    cy.get('[data-testid="addfunds-submit"]').click();
    cy.get('[data-testid="addfunds-amount"]').then(($input) => {
      expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
    });
  });
}); 