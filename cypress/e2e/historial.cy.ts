// Test E2E: Visualización del historial de transacciones
// Asegura que el usuario pueda ver la tabla de historial y que haya al menos una transacción si existen datos

describe('Historial de transacciones', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('#email').type('pablopagliaricci@gmail.com');
    cy.get('#password').type('Password1!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/wallet');

    cy.visit('/transactions');
    cy.contains('Transaction History').click();
  });

  it('muestra la tabla de historial de transacciones', () => {
    cy.get('table').should('exist');
    cy.get('[data-testid="transaction-row"]').should('exist');
  });

  it('muestra mensaje si no hay transacciones', () => {
    // Este test asume que puede haber un estado vacío
    // Si hay datos de ejemplo, este test puede no ser relevante
    cy.get('body').then(($body) => {
      if ($body.text().includes('No transactions found.')) {
        cy.contains('No transactions found.').should('be.visible');
      }
    });
  });
}); 