describe("Bonus", () => {
  beforeEach(() => {
    cy.intercept({
      url: "https://official-joke-api.appspot.com/jokes/*/ten",
    }).as("jokesBody");

    cy.visit("./index_bonus.html");

    cy.wait("@jokesBody");
  });

  it("selects jokes from the general category when selected", () => {
    cy.get("select").select("general");

    cy.wait("@jokesBody").then((interception) => {
      expect(interception.request.url).to.equal(
        "https://official-joke-api.appspot.com/jokes/general/ten"
      );
    });
  });

  it("selects jokes from a specific category when selected", () => {
    cy.get("select").select("programming");

    cy.wait("@jokesBody").then((interception) => {
      expect(interception.request.url).to.equal(
        "https://official-joke-api.appspot.com/jokes/programming/ten"
      );
    });
  });

  it("does not show repeat jokes", () => {
    cy.intercept("https://official-joke-api.appspot.com/jokes/programming/ten", (request) => {
      request.reply([
        {
          setup: "First Joke?",
          punchline: "First.",
        },
      ]);
    });

    // We change the category endpoint to avoid a Cypress bug around not being able to duplicate requests.
    // https://github.com/cypress-io/cypress/issues/9302
    cy.get("select").select("programming");

    cy.intercept("https://official-joke-api.appspot.com/jokes/general/ten", (request) => {
      request.reply([
        {
          setup: "First Joke?",
          punchline: "First.",
        },
        {
          setup: "Second Joke?",
          punchline: "Second.",
        },
      ]);
    });

    cy.get("select")
      .select("general")
      .get(".card")
      .its("length")
      .should("equal", 1)
      .get(".card")
      .first()
      .contains("Second Joke?Second.");
  });
});
