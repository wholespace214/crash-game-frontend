const getRouteWithParameters = function (route, parameterValues) {
  for (const [parameterKey, parameterValue] of Object.entries(
    parameterValues
  )) {
    const routeParameterKey = ':' + parameterKey;
    // @TODO: linter was complaining about "no-useless-escape", not sure if this a case where the escape is needed?
    // I disabled linter for the lines for now
    if (route.endsWith(parameterKey) || route.endsWith(parameterKey + '?')) {
      // eslint-disable-next-line no-useless-escape
      route = route.replace(
        new RegExp(routeParameterKey + '[?]?$'),
        parameterValue
      );
    }
    // eslint-disable-next-line no-useless-escape
    route = route.replace(
      new RegExp(routeParameterKey + '[?]?/'),
      parameterValue + '/'
    );
  }

  return route;
};

export default {
  getRouteWithParameters,
  activities: '/activities',
  event: '/trade/:eventSlug?',
  bet: '/trade/:eventSlug?/:betSlug?',
  betApproveDirect: '/bet/:eventId/:betId/:tradeId',
  newBet: '/trade/new',
  events: '/events/:category?',
  games: '/games',
  home: '/',
  liveEvents: '/live-events/:category?',
  newLiveEvent: '/live-events/new',
  logout: '/logout',
  privacyPolicy: '/privacy-policy',
  rosiGame: '/games/:slug',
  plinkoGame: '/games/plinko',
  elonGame: '/games/elon-game',
  rouletteGame: '/games/alpaca-wheel',
  elonWallpaper: '/games/elon-wallpaper',
  termsAndConditions: '/terms-and-conditions',
  verify: '/verify',
  chart: 'event/bet/:betId/history/chart',
  rewards: '/rewards',
  resetPassword: '/reset-password',
  user: '/user/:userId?',
};
