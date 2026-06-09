describe("Admin Spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/login");
  });
 
  it("should login", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('admin@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
  });
 
  it("should delete a monitor ", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('admin@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('a[href="/monitors"]').click();
    cy.get('div:nth-child(1) > button.absolute').click();
  });

 
  it("should delete a post of user", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('admin@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('div:nth-child(1) > div.gap-3.items-center > button.flex').click();
  });
});
 