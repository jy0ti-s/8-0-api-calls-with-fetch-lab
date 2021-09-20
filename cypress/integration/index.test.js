describe("Index", () => {
  beforeEach(() => {
    cy.visit("./index.html");
  });

  it("loads ten jokes at first", () => {
    cy.get(".card").its("length").should("eq", 10);
  });

  it("expands a card when clicked", () => {
    let originalTitle;
    cy.get(".card")
      .first()
      .then(($card) => {
        originalTitle = $card.children(":visible").text();
        return $card;
      })
      .click()
      .should(($card) => {
        expect($card.children(":visible").text()).not.to.be.equal(originalTitle);
      });
  });

  it("contracts a card when clicked a second time", () => {
    let originalTitle;
    cy.get(".card")
      .first()
      .then(($card) => {
        originalTitle = $card.children(":visible").text();
        return $card;
      })
      .click()
      .click()
      .should(($card) => {
        expect($card.children(":visible").text()).to.be.equal(originalTitle);
      });
  });

  it("reloads new jokes when the reloader is clicked", { retries: 2 }, () => {
    let originalTitle;
    cy.get(".card")
      .first()
      .then(($card) => {
        originalTitle = $card.children(":visible").text();
        return $card;
      })
      .get("#reload")
      .click()
      .get(".card")
      .first()
      .should(($card) => {
        expect($card.children(":visible").text()).not.to.be.equal(originalTitle);
      });
  });
});
