describe('OrangeHRM Login dengan Cypress Intercept', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('input[name="username"]', { timeout: 15000 }).should('be.visible');
  });

  it('TC_INT_01: Login valid & Intercept API Action Summary', () => {
    // Tambahan ** di akhir untuk menangkap parameter tersembunyi
    cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary**').as('actionSummary');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@actionSummary').its('response.statusCode').should('be.oneOf', [200, 304]);
    cy.url().should('include', '/dashboard');
  });

  it('TC_INT_02: Login invalid & Intercept API i18n Messages', () => {
    cy.intercept('GET', '**/core/i18n/messages**').as('getMessages');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salahpassword');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@getMessages').its('response.statusCode').should('be.oneOf', [200, 304]);
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC_INT_03: Forgot Password & Intercept Rute Reset', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode**').as('resetPage');
    
    cy.get('.orangehrm-login-forgot').click();
    
    cy.wait('@resetPage').its('response.statusCode').should('eq', 200);
  });

  it('TC_INT_04: Login case-insensitive & Intercept API Shortcuts', () => {
    cy.intercept('GET', '**/api/v2/dashboard/shortcuts**').as('shortcuts');
    
    cy.get('input[name="username"]').type('admin'); 
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@shortcuts').its('response.statusCode').should('be.oneOf', [200, 304]);
  });

  it('TC_INT_05: Login via Enter & Intercept API Time at Work', () => {
    cy.intercept('GET', '**/api/v2/dashboard/employees/time-at-work**').as('timeAtWork');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123{enter}');
    
    cy.wait('@timeAtWork').its('response.statusCode').should('be.oneOf', [200, 304]);
  });

  it('TC_INT_06: Validasi Method pada Intercept i18n saat Login Gagal', () => {
    cy.intercept('GET', '**/core/i18n/messages**').as('checkMethod');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIN123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@checkMethod').then((interception) => {
      expect(interception.request.method).to.equal('GET');
    });
  });

  it('TC_INT_07: Logout & Intercept Halaman Login URL', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-userdropdown-name', { timeout: 10000 }).should('be.visible').click();
    
    cy.intercept('GET', '**/auth/login**').as('loginRedirect');
    cy.contains('Logout').click();
    
    cy.wait('@loginRedirect').its('response.statusCode').should('eq', 200);
  });

  it('TC_INT_08: Valid Login & Intercept API Leaves', () => {
    cy.intercept('GET', '**/api/v2/dashboard/employees/leaves**').as('leaves');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@leaves').then((interception) => {
      expect(interception.response).to.have.property('body');
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
    });
  });

});