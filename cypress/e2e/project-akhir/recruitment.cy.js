import loginPage from '../../pagesprojectakhir/LoginPage';
import recPage from '../../pagesprojectakhir/RecruitmentPage';

describe('Recruitment Feature', () => {
  let data;
  before(() => { cy.fixture('orangeData').then((d) => { data = d; }); });
  
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => { win.sessionStorage.clear(); });

    loginPage.visit();
    
    cy.wait(2000); 
    
    loginPage.login(data.validUser.username, data.validUser.password);
    cy.intercept('GET', '**/recruitment/candidates**').as('getCand');
    recPage.goToRecruitment();
    cy.wait('@getCand');
  });

  it('TC01: Access Recruitment Page', () => {
    cy.url().should('include', '/recruitment');
  });

  it('TC02: Search Valid Candidate', () => {
    cy.intercept('GET', '**/candidates?**').as('searchCand');
    recPage.searchCandidate('a');
    cy.wait('@searchCand').its('response.statusCode').should('eq', 200);
  });

  it('TC03: Search Invalid Candidate', () => {
    recPage.elements.nameInput().type(data.recruitment.invalidName);
    cy.contains('No Records Found', { timeout: 10000 }).should('be.visible');
  });

  it('TC04: Search by Vacancy', () => {
    cy.intercept('GET', '**/candidates?**').as('vacSearch');
    cy.get('.oxd-select-text').first().click();
    cy.wait(2000); 
    cy.get('.oxd-select-option', { timeout: 10000 }).should('have.length.at.least', 1).last().click({ force: true });
    recPage.elements.searchBtn().click();
    cy.wait('@vacSearch');
  });

  it('TC05: Click Add Candidate', () => {
    cy.intercept('GET', '**/recruitment/vacancies**').as('vac');
    recPage.elements.addBtn().click();
    cy.wait('@vac');
    cy.url().should('include', 'addCandidate');
  });

  it('TC06: Validate Add Candidate Form', () => {
    recPage.elements.addBtn().click();
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message', { timeout: 10000 }).should('contain', 'Required');
  });

  it('TC07: View Candidate Profile', () => {
    cy.intercept('GET', '**/candidates/**').as('profile');
    cy.get('.oxd-table-row', { timeout: 15000 }).last().find('button').first().click({ force: true });
    cy.wait('@profile');
  });

  it('TC08: Delete Candidate Cancelation', () => {
    cy.get('.oxd-table-row', { timeout: 15000 }).last().find('.bi-trash').click({ force: true });
    cy.contains('button', 'No, Cancel', { timeout: 10000 }).click();
    cy.get('.oxd-table-row').should('have.length.greaterThan', 0);
  });
});