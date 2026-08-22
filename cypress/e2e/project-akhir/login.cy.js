import loginPage from '../../pagesprojectakhir/LoginPage';

describe('Login Feature', () => {
  let data;
  before(() => { cy.fixture('orangeData').then((d) => { data = d; }); });
  beforeEach(() => { 
    Cypress.on('uncaught:exception', () => false);
    loginPage.visit(); 
  });

  it('TC01: Valid Login', () => {
    cy.intercept('GET', '**/action-summary**').as('summary');
    loginPage.login(data.validUser.username, data.validUser.password);
    cy.wait('@summary').its('response.statusCode').should('be.oneOf', [200, 304]);
    cy.url().should('include', '/dashboard');
  });
  it('TC02: Invalid Password', () => {
    cy.intercept('GET', '**/messages**').as('msg');
    loginPage.login(data.invalidUser.username, data.invalidUser.password);
    cy.wait('@msg');
    loginPage.elements.err().should('be.visible');
  });
  it('TC03: Empty Username', () => {
    cy.intercept('GET', '**/messages**').as('msg');
    loginPage.login(null, data.validUser.password);
    loginPage.elements.req().should('contain', 'Required');
  });
  it('TC04: Empty Password', () => {
    loginPage.login(data.validUser.username, null);
    loginPage.elements.req().should('contain', 'Required');
  });
  it('TC05: Empty Both', () => {
    loginPage.login(null, null);
    loginPage.elements.req().should('have.length', 2);
  });
  it('TC06: Login via Enter', () => {
    cy.intercept('GET', '**/time-at-work**').as('time');
    loginPage.elements.user().type(data.validUser.username);
    loginPage.elements.pass().type(`${data.validUser.password}{enter}`);
    cy.wait('@time');
  });
  it('TC07: Case Insensitive Username', () => {
    cy.intercept('GET', '**/shortcuts**').as('short');
    loginPage.login(data.validUser.username.toLowerCase(), data.validUser.password);
    cy.wait('@short');
  });
  it('TC08: Forgot Password Link', () => {
    cy.intercept('GET', '**/requestPasswordResetCode**').as('reset');
    cy.get('.orangehrm-login-forgot').click();
    cy.wait('@reset');
    cy.url().should('include', 'requestPasswordResetCode');
  });
});