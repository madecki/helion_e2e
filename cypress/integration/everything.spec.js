describe('Renders website elements properly', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('everything.json').as('everything')
    cy.route('GET', '**/v2/everything*', '@everything').as('fetchEverything')
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="news-type-selection"]').select('everything')
  })

  it('Renders "get news" button disabled if no query has been provided into an input', () => {
    cy.get('[data-testid="get-news"]').should('be.disabled');
  })

  it('Selects "everything" as a type of news to fetch, clicks on "get news" btn and sends request', () => {
    cy.get('[data-testid="news-query"]').type('Bla bla bla')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
  })

  it('Renders downloaded news on the list', () => {
    cy.get('[data-testid="news-query"]').type('Bla bla bla')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
    cy.get('[data-testid="news-element"]').first().find('h2').contains('Żeby zrozumieć zaawansowane koncepcje, należy mieć solidne podstawy.')
  })

  it('Renders error alert if there was an error while fetching news', () => {
    cy.route({
      method: 'GET',
      url: '**/v2/everything*',
      response: [],
      status: 404
    }).as('fetchEverything')
    cy.get('[data-testid="news-query"]').type('Bla bla bla')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
    cy.get('[data-testid="news-error-alert"]').contains("Couldn't fetch news data.")
  })
})

describe('Selecting everything, choosing date range and typing query', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('everything.json').as('everything')
    cy.route('GET', '**/v2/everything*', '@everything').as('fetchEverything')
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="news-type-selection"]').select('everything')
  })

  it('Displays date range inputs', () => {
    cy.get('[data-testid="news-date-from"]')
    cy.get('[data-testid="news-date-to"]')
  })

  it('Fills date range inputs with dates in the correct format and gets news', () => {
    cy.get('[data-testid="news-date-from"]').type('2021-12-24')
    cy.get('[data-testid="news-date-to"]').type('2021-12-31')
    cy.get('[data-testid="news-query"]').type('Christmas time')
    cy.get('[data-testid="get-news"]').click()
    return cy.wait('@fetchEverything').then(request => {
      expect(request.url).match(/from=2021-12-24&to=2021-12-31/);
    });
  })

  it('Fills date range inputs with dates in the incorrect format', () => {
    cy.get('[data-testid="news-date-from"]').type('24.12.2021')
    cy.get('[data-testid="news-date-to"]').type('31.12.2021')
    cy.get('[data-testid="news-query"]').type('Christmas time')
    cy.get('[data-testid="get-news"]').click()
    cy.get('[data-testid="news-element"]').should('not.exist');
    cy.get('[data-testid="news-error-alert"]').should('not.exist');
  })
});