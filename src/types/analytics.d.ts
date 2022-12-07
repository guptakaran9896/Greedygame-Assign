declare namespace AnalyticsNS {
    
    interface IStructuredAnalyticsData {
        [key:string] : any
    }

    interface IArrangeColumns {
        name: string;
        isDisplay: boolean;
    }

    interface IColumnFilters {
        [key:string]: APIResponseNS.IEachAppData[] | number;
    }

    interface ICachedData {
        appsAPIData: APIResponseNS.IEachAppData[],
        analyticsAPIData: IStructuredAnalyticsData[],
        arrangeColumnsData: IArrangeColumns[],
        timeStamp: Date,
        columnsFilter: IColumnFilters;
    }

    interface IState {
        analyticsData: IStructuredAnalyticsData[];
        analyticsDataCopy: IStructuredAnalyticsData[];
        arrangeColumnsData: IArrangeColumns[];
        startDate: string;
        endDate: string;
        isLoading: boolean;
        appsAPIData: APIResponseNS.IEachAppData[];
        columnFilters: IColumnFilters;
    }

    interface IActionTypes {
        ANALYTICS_SET_INITIAL_DATA: 'ANALYTICS_SET_INITIAL_DATA';
        ANALYTICS_SET_ARRANGE_COLUMNS: 'ANALYTICS_SET_ARRANGE_COLUMNS';
        ANALYTICS_SET_COLUMN_FILTERS: 'ANALYTICS_SET_COLUMN_FILTERS';
        ANALYTICS_SET_DATES: 'ANALYTICS_SET_DATES';
        ANALYTICS_SET_LOADER: 'ANALYTICS_SET_LOADER';
    }

    interface IATSetInitialData {
        type: IActionTypes['ANALYTICS_SET_INITIAL_DATA'];
        payload: {
            analyticsData: IStructuredAnalyticsData[];
            arrangeColumnsData: IArrangeColumns[];
            startDate: string;
            endDate: string;
            appsAPIData: APIResponseNS.IEachAppData[],
            columnFilter: IState['columnFilters'],
            analyticsDataCopy: IState['analyticsDataCopy']
        }
    }

    interface IATSetArrangeColumns {
        type: IActionTypes['ANALYTICS_SET_ARRANGE_COLUMNS'];
        payload: {
            arrangeColumnsData: IArrangeColumns[];
        }
    }

    interface IATSetDates {
        type: IActionTypes['ANALYTICS_SET_DATES'];
        payload: {
            startDate: string;
            endDate: string;
        } 
    }

    interface IATSetLoader {
        type: IActionTypes['ANALYTICS_SET_LOADER'];
        payload: {
            isLoading: boolean;
        }
    }

    interface IATSetColumnFilters {
        type: IActionTypes['ANALYTICS_SET_COLUMN_FILTERS'];
        payload: {
            analyticsData: IStructuredAnalyticsData[];
            columnFilters: IColumnFilters;
        }
    }

    type AllActions =
        | IATSetInitialData
        | IATSetArrangeColumns
        | IATSetDates
        | IATSetLoader
        | IATSetColumnFilters;

    interface IActionCreators {
        setInitialData: (
        ) => ReduxNS.IThunkFunction<AllActions>;
        setDates: (
            startDate: string,
            endDate: string,
        ) => ReduxNS.IThunkFunction<AllActions>;
        setArrangeColumnsData: (
            arrangeColumnsData: IArrangeColumns[],
        ) => ReduxNS.IThunkFunction<AllActions>; 
        setColumnFilters: (
            columnName?: string,
            filterValue?: APIResponseNS.IEachAppData[] | number,
        ) => ReduxNS.IThunkFunction<AllActions>;
    }

    interface IDateSettingsProps {
        startDate: string;
        endDate: string;
        arrangeColumnsData: IArrangeColumns[];
    }

    interface IArrangeColumnsProps {
        setDisplayArrangeColumns: (...args:any) => void;
        setArrangeColumnsData: (...args:any) => void;
        arrangeColumnsData: IArrangeColumns[];
    }

    interface ITableProps {
        arrangeColumnsData: IArrangeColumns[];
        analyticalData: IStructuredAnalyticsData[];
        analyticDataCopy: IStructuredAnalyticsData[];
        appsAPIData: APIResponseNS.IEachAppData[];
        columnFilters: IColumnFilters;
    }

}