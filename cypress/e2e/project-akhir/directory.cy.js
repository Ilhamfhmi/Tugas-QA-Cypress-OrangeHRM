import loginPage from '../../pagesprojectakhir/LoginPage';
import dirPage from '../../pagesprojectakhir/DirectoryPage';

describe('Directory Feature', () => {
  let data;
  before(() => { cy.fixture('orangeData').then((d) => { data = d; }); });
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
    loginPage.visit();
    loginPage.login(data.validUser.username, data.validUser.password);
    cy.intercept('GET', '**/directory/employees**').as('getEmp');
    dirPage.goToDirectory();
    cy.wait('@getEmp');
  });

  it('TC01: Access Directory Page', () => {
    cy.url().should('include', '/directory');
  });

  it('TC02: Search Valid Name', () => {
    cy.intercept('GET', '**/directory/employees**').as('searchName');
    dirPage.searchName('a');
    cy.wait('@searchName').its('response.statusCode').should('eq', 200);
  });

  it('TC03: Search Invalid Name', () => {
    dirPage.elements.nameInput().type(data.directory.invalidName);
    cy.contains('No Records Found', { timeout: 10000 }).should('be.visible');
  });

  it('TC04: Search by Job Title', () => {
    cy.intercept('GET', '**/directory/employees**').as('jobSearch');
    cy.get('.oxd-select-text').first().click();
    cy.get('.oxd-select-option', { timeout: 10000 }).should('have.length.at.least', 1).last().click();
    dirPage.elements.searchBtn().click();
    cy.wait('@jobSearch');
  });

  it('TC05: Search by Location', () => {
    cy.intercept('GET', '**/directory/employees**').as('locSearch');
    cy.get('.oxd-select-text').eq(1).click();
    cy.get('.oxd-select-option', { timeout: 10000 }).should('have.length.at.least', 1).last().click();
    dirPage.elements.searchBtn().click();
    cy.wait('@locSearch');
  });

  it('TC06: Reset Search Form', () => {
    dirPage.elements.nameInput().type(data.directory.validName);
    dirPage.elements.resetBtn().click();
    dirPage.elements.nameInput().should('be.empty');
  });

  it('TC07: Verify Card Visibility', () => {
    cy.get('.oxd-grid-item', { timeout: 15000 }).should('be.visible');
  });

  it('TC08: View Employee Details', () => {
    cy.get('.oxd-grid-item', { timeout: 15000 }).first().click();
    cy.get('.oxd-sheet', { timeout: 15000 }).should('be.visible');
  });
});