class LoginPage {
  elements = {
    user: () => cy.get('input[name="username"]'),
    pass: () => cy.get('input[name="password"]'),
    btn: () => cy.get('button[type="submit"]'),
    err: () => cy.get('.oxd-alert-content-text'),
    req: () => cy.get('.oxd-input-group__message')
  }
  visit() { cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'); }
  login(u, p) { 
    if(u) this.elements.user().type(u); 
    if(p) this.elements.pass().type(p); 
    this.elements.btn().click(); 
  }
}
export default new LoginPage();