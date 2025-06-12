// Ignora errores uncaught del frontend para depuración
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Login de usuario', () => {
  before(() => {
    // Registra el usuario antes de todos los tests (usando la UI)
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/register');
    cy.url().should('include', '/register');
    cy.get('[data-testid="register-name"]').type('Pablo Pagliaricci');
    cy.get('[data-testid="register-email"]').clear().type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="register-password"]').type('Password1!');
    cy.get('[data-testid="register-confirm-password"]').type('Password1!');
    cy.get('[data-testid="register-submit"]').click();
    // Puede que ya exista, así que ignoramos el error si el usuario ya está registrado
    cy.url().should('include', '/login');
  });

  beforeEach(() => {
    // Limpiar cookies y localStorage antes de cada test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.url().should('include', '/login');
  });

  it('permite iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('/login');

    // Verificar que los campos del formulario estén presentes
    cy.get('[data-testid="login-email"]').should('be.visible');
    cy.get('[data-testid="login-password"]').should('be.visible');
    cy.get('[data-testid="login-submit"]').should('be.visible');

    // Ingresar credenciales válidas
    cy.get('[data-testid="login-email"]').type('pablopagliaricci@gmail.com');
    cy.get('[data-testid="login-password"]').type('Password1!');
    cy.get('[data-testid="login-submit"]').click();


    // Verificar toast de éxito
    cy.contains('Login successful!').should('be.visible');

    // Verificar redirección y elementos de la página principal
    cy.url().should('include', '/wallet');
    cy.contains('Balance').should('be.visible');
  });

  it('muestra error con credenciales inválidas', () => {
    cy.visit('/login');

    // Ingresar credenciales inválidas
    cy.get('[data-testid="login-email"]').type('usuario@ejemplo.com');
    cy.get('[data-testid="login-password"]').type('password_incorrecto');
    cy.get('[data-testid="login-submit"]').click();

    // Verificar toast de error
    cy.contains('Invalid email or password').should('be.visible');
    
    // Verificar que permanecemos en la página de login
    cy.url().should('include', '/login');
  });

  it('valida campos requeridos', () => {
    cy.visit('/login');

    // Intentar enviar formulario sin datos
    cy.get('[data-testid="login-submit"]').click();

    // Verificar mensajes de error personalizados
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');

    // Verificar que permanecemos en la página de login
    cy.url().should('include', '/login');
  });

  it('permite mostrar/ocultar contraseña', () => {
    cy.visit('/login');

    // Verificar que la contraseña está oculta por defecto
    cy.get('[data-testid="login-password"]').should('have.attr', 'type', 'password');

    // Hacer clic en el botón de mostrar contraseña
    cy.get('[aria-label="Show password"]').click();

    // Verificar que la contraseña se muestra
    cy.get('[data-testid="login-password"]').should('have.attr', 'type', 'text');

    // Hacer clic en el botón de ocultar contraseña
    cy.get('[aria-label="Hide password"]').click();

    // Verificar que la contraseña se oculta
    cy.get('[data-testid="login-password"]').should('have.attr', 'type', 'password');
  });
});