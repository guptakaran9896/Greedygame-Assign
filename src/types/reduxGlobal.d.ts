declare namespace ReduxNS {
    interface IState {
      Analytics: AnalyticsNS.IState
    }
  
    interface IThunkFunction<Actions> {
        (
            dispatch: import('react').Dispatch<Actions>,
            getAppState: () => ReduxNS.IState,
        ): void;
    }
  }