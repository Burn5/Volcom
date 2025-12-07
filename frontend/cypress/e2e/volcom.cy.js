describe('VolCom basic navigation', () => {
  it('goes from Home to Opportunities', () => {
    // 👇 Your Vite dev URL
    cy.visit('http://localhost:5173/');

    // Home page loaded
    cy.contains('VolCom');

    // Click "View Opportunities"
    cy.contains('View Opportunities').click();

    // URL should now include "/opportunities"
    cy.url().should('include', '/opportunities');

    // Check text that we know exists on Opportunities page
    cy.contains('Volunteer Opportunities').should('exist');
    cy.contains('Saved:').should('exist');
  });
});
