describe("Admin Spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/login");
  });
 
  it("should login", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('admin@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
  });
 
  it("should create a monitor", () => {});

 
  it("should delete a  monitor", () => {});
});
 