describe('happy path', () => {
  it('happy path admin', () => {
    // Registers successfully
    cy.visit('http://localhost:3000/signup')
    cy.get('input[type=text]').focus().type('james');
    cy.get('input[type=email]').focus().type('james7@email.com');
    cy.get('input[type=password]').focus().type('betty');
    cy.contains('Sign Up').click();
    // Check if successfully signs in and redirects to dashboard
    cy.url().should('include', '/dashboard');


    // Creates a new game successfully
    cy.contains('Add Game').click();
    cy.get('input[id=name]').focus().type('game 1');
    cy.contains('Create').click();
    // Check if game is displayed in dashboard
    cy.contains('game 1').should('be.visible');


    // Starts a game successfully
    cy.contains('Activate Game').click();
    // Checks if Activate Game works
    cy.contains('Stop Game').should('be.visible');
    cy.contains('Game Screen').click();
    cy.url().should('include', '/quiz');
    // Checks if redirect to Game Screen works
    // Ends a game successfully (yes, no one will have played it)
    // Loads the results page successfully
    cy.contains('No players have joined yet').should('be.visible');
    cy.contains('Start Game').click();
    // Since there's no questions, starting game will redirect to results page
    // Check if redirect to Results page works
    cy.contains('Leaderboard').should('be.visible');
    cy.get('table').should('be.visible');

    // Logs out of the application successfully
    cy.contains('LogOut').click();
    cy.url().should('include', '/signin');

    // Logs back into the application successfully
    cy.visit('http://localhost:3000/signin')
    cy.get('input[type=email]').focus().type('james7@email.com');
    cy.get('input[type=password]').focus().type('betty');
    cy.contains('Sign In').click();
    cy.url().should('include', '/dashboard');

  })


})
