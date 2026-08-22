class RecruitmentPage {
  elements = {
    menu: () => cy.contains('span', 'Recruitment'),
    nameInput: () => cy.get('input[placeholder="Type for hints..."]'),
    searchBtn: () => cy.get('button[type="submit"]'),
    addBtn: () => cy.contains('button', 'Add')
  }
  goToRecruitment() { this.elements.menu().click(); }
  searchCandidate(name) { this.elements.nameInput().type(name); this.elements.searchBtn().click(); }
}
export default new RecruitmentPage();