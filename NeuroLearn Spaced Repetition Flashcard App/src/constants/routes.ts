const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  decks: '/decks',
  deckDetail: (deckId: string) => `/decks/${deckId}`,  // dynamic route
  review: (deckId: string) => `/review/${deckId}`,    // dynamic route
  analytics: '/analytics',
  settings: '/settings',
  notFound: '*', // catch-all for 404 page
};

export default routes;