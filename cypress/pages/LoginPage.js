// cypress/pages/LoginPage.js

class LoginPage {
  // 1. Identifikasi Elemen (Locator)
  elements = {
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    loginBtn: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get('.oxd-alert-content-text'),
    requiredMessage: () => cy.get('.oxd-input-group__message'),
    forgotPasswordLink: () => cy.get('.orangehrm-login-forgot')
  }

  // 2. Metode Aksi (Action)
  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  typeUsername(username) {
    this.elements.usernameInput().type(username);
  }

  typePassword(password) {
    this.elements.passwordInput().type(password);
  }

  clickLogin() {
    this.elements.loginBtn().click();
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
  }

  // Metode gabungan untuk mempermudah tes
  loginWithCredentials(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLogin();
  }
}

// Mengekspor class agar bisa digunakan di file tes
export default new LoginPage();