
describe('Mosaic Knitting Converter - System Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('disables Generate Chart when input is empty', () => {
    cy.contains('button', 'Generate Chart')
      .should('be.disabled');
  });

  it('generates a visual chart from knitting instructions', () => {
    cy.get('#pattern-text')
      .type('Row 1: k1, sl1, k1');

    cy.contains('button', 'Generate Chart')
      .click();

    cy.get('.pattern-chart')
      .should('be.visible');

    cy.get('.chart-row')
      .should('have.length', 1);

    cy.get('.chart-cell')
      .should('have.length', 3);

    cy.get('.row-number')
      .should('contain', '1');
  });

  it('updates the chart when instructions are changed', () => {
    cy.get('#pattern-text')
      .type('Row 1: k1, sl1, k1');

    cy.contains('button', 'Generate Chart')
      .click();

    cy.get('.chart-cell')
      .should('have.length', 3);

    cy.get('#pattern-text')
      .clear()
      .type('Row 1: k1, sl1, k1, sl1, k1');

    cy.contains('button', 'Generate Chart')
      .click();

    cy.get('.chart-cell')
      .should('have.length', 5);
  });
});
