// cypress/e2e/tugas-17/login-pom.cy.js

// Mengimpor class LoginPage dari folder pages
import loginPage from '../../pages/LoginPage';

describe('OrangeHRM Login Automation with POM', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    // Memanggil metode visit dari file POM
    loginPage.visit();
    // Memastikan form terlihat sebelum tes dilanjutkan
    loginPage.elements.usernameInput().should('be.visible');
  });

  it('TC_POM_01: Login dengan kredensial valid', () => {
    // Action menggunakan POM
    loginPage.loginWithCredentials('Admin', 'admin123');
    // Validasi
    cy.url().should('include', '/dashboard');
  });

  it('TC_POM_02: Login dengan password salah', () => {
    loginPage.loginWithCredentials('Admin', 'salahpassword');
    loginPage.elements.errorMessage().should('have.text', 'Invalid credentials');
  });

  it('TC_POM_03: Login dengan field username kosong', () => {
    loginPage.typePassword('admin123');
    loginPage.clickLogin();
    loginPage.elements.requiredMessage().should('have.text', 'Required');
  });

  it('TC_POM_04: Login dengan field password kosong', () => {
    loginPage.typeUsername('Admin');
    loginPage.clickLogin();
    loginPage.elements.requiredMessage().should('have.text', 'Required');
  });

  it('TC_POM_05: Login dengan form kosong semua', () => {
    loginPage.clickLogin();
    loginPage.elements.requiredMessage().should('have.length', 2).and('contain.text', 'Required');
  });

  it('TC_POM_06: Navigasi fitur Forgot your password', () => {
    loginPage.clickForgotPassword();
    cy.url().should('include', '/requestPasswordResetCode');
  });

  it('TC_POM_07: Login dengan username menggunakan huruf kecil semua', () => {
    // OrangeHRM username bersifat case-insensitive
    loginPage.loginWithCredentials('admin', 'admin123');
    cy.url().should('include', '/dashboard');
  });

  it('TC_POM_08: Login dengan password case-sensitive (huruf besar)', () => {
    // OrangeHRM password bersifat case-sensitive
    loginPage.loginWithCredentials('Admin', 'ADMIN123');
    loginPage.elements.errorMessage().should('have.text', 'Invalid credentials');
  });

});