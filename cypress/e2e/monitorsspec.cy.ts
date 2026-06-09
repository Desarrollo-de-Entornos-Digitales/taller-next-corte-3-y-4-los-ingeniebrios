describe("Monitor Spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/login");
  });
 
  it("should login as monitor", (

  ) => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('moderator@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('select.w-full').select('4');
    cy.get('button:nth-child(4)').click();
    cy.get('button.w-full').click();
  });
 
  it("should answer questions", (

  ) => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('moderator@u.icesi.edu.co');
    cy.get('form.flex').click();
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('select.w-full').select('4');
    cy.get('button:nth-child(4)').click();
    cy.get('button.w-full').click();
    cy.get('a[href="/comments/3"]').click();
    cy.get('textarea.border').click();
    cy.get('textarea.border').type('estudia mucho');
    cy.get('button.text-white').click();
  });
 
});
 