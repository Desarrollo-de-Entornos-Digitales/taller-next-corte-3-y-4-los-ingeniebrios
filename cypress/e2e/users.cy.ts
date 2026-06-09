describe("Student Spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/login");
  });
 
  it("should login as a user", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('juan.perez@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
  });

  it("should select carrer and semester", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('juan.perez@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('select.w-full').select('3');
    
  });
 
  it("should publish a post", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('juan.perez@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('select.w-full').select('3');
    cy.get('button:nth-child(4)').click();
    cy.get('button.w-full').click();
    cy.get('a[href="/questions"]').click();
    cy.get('div:nth-child(1) > select.border').select('1');
    cy.get('div:nth-child(2) > select.border').select('1');
    cy.get('input.border').click();
    cy.get('input.border').type('pregunta sobre principios de economia');
    cy.get('textarea.border').click();
    cy.get('textarea.border').type('que es la macro y micro economia?');
    cy.get('button.w-full').click();
  });
 
  it("should comment on a post", () => {
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('juan.perez@u.icesi.edu.co');
    cy.get('[name="password"]').click();
    cy.get('[name="password"]').type('password');
    cy.get('button.font-bold').click();
    cy.get('select.w-full').select('7');
    cy.get('button:nth-child(4)').click();
    cy.get('button.w-full').click();
    cy.get('a[href="/comments/2"] img.h-4').click();
    cy.get('textarea.border').click();
    cy.get('textarea.border').type('Yo tengo ');
    cy.get('button.text-white').click();
  });
});
 