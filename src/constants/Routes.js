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
  bet: '/trade/:eventSlug?/:betSlug?',
  events: '/events/:category?',
  games: '/games',
  home: '/',
  liveEvents: '/live-events/:category?',
  logout: '/logout',
  privacyPolicy: '/privacy-policy',
  rosiGame: '/games/rosi-game',
  termsAndConditions: '/terms-and-conditions',
  walletConfirmation: '/wallet/:paymentAction/:paymentProvider/success',
  walletDeposit: '/wallet/deposit/:paymentProvider',
  walletWithdrawal: '/wallet/withdraw/:paymentProvider',
  verify: '/verify',
  chart: 'event/bet/:betId/history/chart',
};
