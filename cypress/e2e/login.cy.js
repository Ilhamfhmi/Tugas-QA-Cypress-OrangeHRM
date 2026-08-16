describe('OrangeHRM Login Feature', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('input[name="username"]', { timeout: 15000 }).should('be.visible');
  });

  it('TC_LOG_01: Login dengan kredensial valid', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb > h6').should('have.text', 'Dashboard');
  });

  it('TC_LOG_02: Login dengan password salah', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salahpassword');
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC_LOG_03: Login dengan field username kosong', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-input-group__message').should('have.text', 'Required');
  });

  it('TC_LOG_04: Login dengan field password kosong', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-input-group__message').should('have.text', 'Required');
  });

  it('TC_LOG_05: Login dengan form kosong semua', () => {
    // Karena di beforeEach kita sudah menunggu username muncul, 
    // tombol submit pasti sudah ada di DOM.
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-input-group__message').should('have.length', 2).and('contain.text', 'Required');
  });

  it('TC_LOG_06: Navigasi fitur Forgot your password', () => {
    cy.get('.orangehrm-login-forgot').click();
    
    cy.url({ timeout: 10000 }).should('include', '/requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('have.text', 'Reset Password');
  });

  it('TC_LOG_07: Login dengan username menggunakan huruf kecil semua', () => {
    cy.get('input[name="username"]').type('admin'); 
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });

  it('TC_LOG_08: Login dengan password case-sensitive (huruf besar)', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIN123');
    cy.get('button[type="submit"]').click();
    
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC_LOG_09: Login menggunakan tombol Enter di keyboard', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123{enter}');
    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });

  it('TC_LOG_10: Verifikasi keberadaan tautan media sosial di footer', () => {
    cy.get('a[href*="linkedin"]').should('exist').and('have.attr', 'target', '_blank');
    cy.get('a[href*="facebook"]').should('exist').and('have.attr', 'target', '_blank');
    cy.get('a[href*="twitter"]').should('exist').and('have.attr', 'target', '_blank');
    cy.get('a[href*="youtube"]').should('exist').and('have.attr', 'target', '_blank');
  });

  it('TC_LOG_11: Login dengan penambahan spasi pada username', () => {
    cy.get('input[name="username"]').type(' Admin ');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text', { timeout: 10000 }).should('have.text', 'Invalid credentials');
  });

  it('TC_LOG_12: Verifikasi fitur Logout', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('.oxd-userdropdown-name', { timeout: 10000 }).should('be.visible').click(); 
    cy.contains('Logout').click();            
    
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
  });
});