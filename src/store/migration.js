export const MIGRATION_VERSION = 4;

export const migrations = {
  0: state => {
    return {
      ...state,
      leaderboard: {
        ...state.leaderboard,
        leaderboard: {
          ...state.leaderboard,
          leaderboard: undefined,
          currentUser: {
            _id: null,
            username: null,
            rank: null,
            amountWon: null,
            toNextRank: null,
          },
          users: [],
          usersWithCurrent: [],
          total: 0,
          page: 0,
          perPage: 0,
          openDrawer: false,
        },
      },
      event: {
        filteredEvents: [],
        tags: [],
        homeEvents: {
          ['streamed']: [],
          ['non-streamed']: [],
        },
        defaultParams: {
          type: 'all',
          category: 'all',
          count: '30',
          page: '1',
          sortBy: 'name',
          searchQuery: '',
        },
        eventSortOptions: [
          {
            label: 'Alphabetically (A-Z)',
            value: 'name',
          },
          {
            label: 'Alphabetically (Z-A)',
            value: '-name',
          },
          {
            label: 'End date (newest first)',
            value: 'date',
          },
          {
            label: 'End date (oldest first)',
            value: '-date',
          },
        ],
        ...state.event,
      },
      authentication: {
        amountWon: 0,
        toNextRank: 0,
        ...state.authentication,
      },
    };
  },
  1: state => {
    return {
      ...state,
      rosiGame: {
        hasStarted: false,
        lastCrashes: [],
        inGameBets: [],
        userBet: null,
      },
    };
  },
  2: state => {
    return {
      ...state,
      event: {
        ...state.event,
        chartData: [],
      },
    };
  },
  3: state => {
    return {
      ...state,
      event: {
        ...state.event,
        newsData: {
          data: [],
        },
      },
    };
  },
  4: state => {
    return {
      ...state,
      rosiGame: {
        ...state.rosiGame,
        cashedOut: [],
      },
    };
  },
};
