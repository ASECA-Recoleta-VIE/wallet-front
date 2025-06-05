describe('Login de usuario', () => {
  beforeEach(() => {
    // Limpiar cookies y localStorage antes de cada test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('permite iniciar sesión correctamente con credenciales válidas', () => {
    // Visitar la página de login
    cy.visit('/login');

    // Verificar que los campos del formulario estén presentes
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');

    // Ingresar credenciales válidas
    cy.get('#email').type('pablopagliaricci@gmail.com');
    cy.get('#password').type('Password1!');
    cy.get('button[type="submit"]').click();

    // Verificar redirección y elementos de la página principal
    cy.url().should('include', '/wallet');
    cy.contains('Balance').should('be.visible');
    
  });

  it('muestra error con credenciales inválidas', () => {
    cy.visit('/login');

    // Ingresar credenciales inválidas
    cy.get('#email').type('usuario@ejemplo.com');
    cy.get('#password').type('password_incorrecto');
    cy.get('button[type="submit"]').click();

    // Verificar mensaje de error
    cy.contains('Invalid email or password').should('be.visible');
    
    // Verificar que permanecemos en la página de login
    cy.url().should('include', '/login');
    
    // Verificar que no hay cookie de sesión
    cy.getCookie('session').should('not.exist');
  });

  it('valida campos requeridos', () => {
    cy.visit('/login');

    // Intentar enviar formulario sin datos
    cy.get('button[type="submit"]').click();

    // Verificar mensajes de error
    cy.get('#email').then(($input) => {
      expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
    });
    cy.get('#password').then(($input) => {
      expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
    });


    // Verificar que permanecemos en la página de login
    cy.url().should('include', '/login');
  });
});