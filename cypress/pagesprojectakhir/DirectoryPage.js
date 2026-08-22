class DirectoryPage {
  elements = {
    menu: () => cy.contains('span', 'Directory'),
    nameInput: () => cy.get('input[placeholder="Type for hints..."]'),
    searchBtn: () => cy.get('button[type="submit"]'),
    resetBtn: () => cy.get('button[type="reset"]'),
    recordFound: () => cy.get('.orangehrm-horizontal-padding > span')
  }
  goToDirectory() { this.elements.menu().click(); }
  searchName(name) { this.elements.nameInput().type(name); this.elements.searchBtn().click(); }
}
export default new DirectoryPage();