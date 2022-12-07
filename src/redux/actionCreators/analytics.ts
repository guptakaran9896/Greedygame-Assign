import _ from 'lodash';

import {getAnalyticsData, getAppsData} from '../api/apiCalls';
import History from '../../utils/History';
import actionTypes from '../actionTypes/analytics';
import { Dispatch } from 'react';

class ActionCreators implements AnalyticsNS.IActionCreators {

    dispatchSetLoader = (
        isLoading: boolean,
        dispatch: Dispatch<AnalyticsNS.IATSetLoader>,
    ) => {
        dispatch({
            type: actionTypes.ANALYTICS_SET_LOADER,
            payload: {
                isLoading,
            }
        })
    }

    setInitialData: AnalyticsNS.IActionCreators['setInitialData'] = (
    ) => {
        return async(dispatch, getState) => {
            try {
                const queryParams = new URLSearchParams(History.location.search);
                const startDate = queryParams.get('startDate');
                const endDate = queryParams.get('endDate');
                const x = queryParams.get('columns') as string;
                const columnsFilter = queryParams.get('columnFilters') as string;
                const decodeColumns = JSON.parse(decodeURIComponent(x));
                const decodeColumnFilters = JSON.parse(decodeURIComponent(columnsFilter));
                if(startDate!==null && endDate!==null){
                    History.push({
                        pathname: '/analytics',
                        search: '?' + new URLSearchParams(History.location.search)
                    });
                    const data = await this.fetchDataInCache(startDate, endDate);
                    if(typeof decodeColumnFilters['app'] !== 'number') {
                        const updatedAnalyticsData = this.getFilteredAppsData(data.analyticsAPIData, decodeColumnFilters['app']);
                        const finalFilterRangeUpdatedItems = this.getRangeFilteredColumns(updatedAnalyticsData, decodeColumnFilters);
                        dispatch({
                            type: actionTypes.ANALYTICS_SET_INITIAL_DATA,
                            payload: {
                                startDate,
                                endDate,
                                analyticsData: data.analyticsAPIData,
                                arrangeColumnsData: decodeColumns,
                                appsAPIData: data.appsAPIData,
                                columnFilter: decodeColumnFilters,
                                analyticsDataCopy: finalFilterRangeUpdatedItems,
                            }
                        });
                    }   
                }else {
                    this.dispatchSetLoader(false, dispatch);
                }
            }catch {
                this.dispatchSetLoader(false, dispatch);
            }
        }
    }

    arrangeColumnsData= (
        structuredAnalyticsData:AnalyticsNS.IState['analyticsData'],
    ) => {
        let arrangeColumnsData:AnalyticsNS.IState['arrangeColumnsData'] = [];
        const objectKeys = Object.keys(structuredAnalyticsData[0]);
        _.map(objectKeys, (eachKey) => {
            let eachArrangeColumnData:AnalyticsNS.IArrangeColumns = {
                name: eachKey,
                isDisplay: true,
            }
            arrangeColumnsData.push(eachArrangeColumnData);
        });
        return arrangeColumnsData;
    }

    structureData = (
        analyticsData: APIResponseNS.IEachAnalyticsData[], 
        appsData: APIResponseNS.IEachAppData[], 
    ) => {
        let structuredAnalyticsData:AnalyticsNS.IState['analyticsData'] = [];
        _.map(analyticsData, (eachAnalyticData, index) => {
            const appData = _.find(appsData, {'app_id':eachAnalyticData.app_id});
            let eachStructuredAnalyticData: AnalyticsNS.IStructuredAnalyticsData = {
                date: eachAnalyticData.date,
                app: appData?appData.app_name:'',
                requests: eachAnalyticData.requests, 
                responses: eachAnalyticData.responses,
                impressions: eachAnalyticData.impressions,
                clicks: eachAnalyticData.clicks,
                revenue: eachAnalyticData.revenue,
                fillRate: (eachAnalyticData.requests/eachAnalyticData.responses)*100,
                CTR: (eachAnalyticData.clicks/eachAnalyticData.impressions)*100,
            };
            structuredAnalyticsData.push(eachStructuredAnalyticData);
        });
        return structuredAnalyticsData;
    };

    getDataToCache= async(
        startDate: string,
        endDate: string,
    ):Promise<AnalyticsNS.ICachedData> => {
        const analyticsDataAPIResponse = await getAnalyticsData(startDate, endDate);
        const appsAPIData = await getAppsData();
        const structuredAnalyticsData = this.structureData(analyticsDataAPIResponse.data.data, appsAPIData.data.data);
        const arrangeColumnsData = this.arrangeColumnsData(structuredAnalyticsData);
        let dataToStoreInCache:AnalyticsNS.ICachedData = {
            appsAPIData: appsAPIData.data.data,
            analyticsAPIData: structuredAnalyticsData,
            arrangeColumnsData: arrangeColumnsData,
            columnsFilter: this.setInitialColumnFilters(structuredAnalyticsData,appsAPIData.data.data),
            timeStamp: new Date(),
        };
        return dataToStoreInCache;
    }

    fetchDataInCache = async(startDate: string, endDate: string) => {
        const keyToSearch = `${startDate}&${endDate}`;
        if(localStorage.getItem(keyToSearch)) {
            const cachedData:AnalyticsNS.ICachedData = JSON.parse(localStorage.getItem(keyToSearch) as string);
            const pastTime = new Date(cachedData.timeStamp);
            const presentTime = new Date();
            if((presentTime.getTime() - pastTime.getTime())/(60*60*1000) < 2){
                return cachedData;
            }else {
                localStorage.removeItem(keyToSearch);
                const dataToStoreInCache = await this.getDataToCache(startDate, endDate);
                localStorage.setItem(keyToSearch, JSON.stringify(dataToStoreInCache)); 
                return dataToStoreInCache;
            }
        }else {
            const dataToStoreInCache = await this.getDataToCache(startDate, endDate);
            localStorage.setItem(keyToSearch, JSON.stringify(dataToStoreInCache));
            return dataToStoreInCache;
        }
    }

    setQueryParams = (
        startDate: string,
        endDate: string,
        columns: AnalyticsNS.IState['arrangeColumnsData'],
        columnFilters: AnalyticsNS.IState['columnFilters'],
    ) => {
        const encodedColumns = encodeURIComponent(JSON.stringify(columns));
        const encodeColumnFilters = encodeURIComponent(JSON.stringify(columnFilters));
        History.push({
            pathname: '/analytics',
            search: '?' + new URLSearchParams({
                startDate: startDate,
                endDate: endDate,
                columns: encodedColumns,
                columnFilters: encodeColumnFilters,
            })
        });
    }

    setDates: AnalyticsNS.IActionCreators['setDates'] = (
        startDate,
        endDate,
    ) => async(dispatch, getState) => {
        try{
            if(startDate!=='' && endDate!==''){
                if(!getState().Analytics.isLoading){
                    this.dispatchSetLoader(true, dispatch);
                }
                const data = await this.fetchDataInCache(startDate, endDate);
                this.setQueryParams(
                    startDate,
                    endDate,
                    data.arrangeColumnsData,
                    data.columnsFilter,
                );
                dispatch({
                    type: actionTypes.ANALYTICS_SET_INITIAL_DATA,
                    payload: {
                        arrangeColumnsData: data.arrangeColumnsData,
                        analyticsData: data.analyticsAPIData,
                        startDate,
                        endDate,
                        appsAPIData: data.appsAPIData,
                        analyticsDataCopy: data.analyticsAPIData,
                        columnFilter: data.columnsFilter,
                    }
                })
            }else {
                dispatch({
                    type: actionTypes.ANALYTICS_SET_DATES,
                    payload: {
                        startDate,
                        endDate,
                    }
                })
            }
        }catch {
            dispatch({
                type: actionTypes.ANALYTICS_SET_INITIAL_DATA,
                payload: {
                    startDate,
                    endDate,
                    analyticsData: [],
                    arrangeColumnsData: [],
                    appsAPIData: [],
                    analyticsDataCopy: [],
                    columnFilter: {},
                }
            })
        }
    }

    setArrangeColumnsData: AnalyticsNS.IActionCreators['setArrangeColumnsData'] = (
        arrangeColumnsData
    ) => async(dispatch, getState) => {
        this.setQueryParams(
            getState().Analytics.startDate,
            getState().Analytics.endDate,
            arrangeColumnsData,
            getState().Analytics.columnFilters
        );
        dispatch({
            type: actionTypes.ANALYTICS_SET_ARRANGE_COLUMNS,
            payload: {
                arrangeColumnsData,
            }
        })
    }

    dispatchColumnFilters = (
        dispatch: Dispatch<AnalyticsNS.IATSetColumnFilters>,
        columnFilters: AnalyticsNS.IColumnFilters,
        analyticsData: AnalyticsNS.IStructuredAnalyticsData[],
    ) => {
        dispatch({
            type: actionTypes.ANALYTICS_SET_COLUMN_FILTERS,
            payload: {
                columnFilters,
                analyticsData,
            }
        });
    }

    getFilteredAppsData = (
        analyticsData: AnalyticsNS.IStructuredAnalyticsData[],
        searchAppColumnData: APIResponseNS.IEachAppData[],
    ) => {
        const appNames:string[] = [];
        _.map(searchAppColumnData, (eachAppDetail) => {
            appNames.push(_.toLower(eachAppDetail.app_name));
        });
        const filteredData = _.filter(analyticsData, (eachAnalyticsData) => {
            return _.includes(appNames, _.toLower(eachAnalyticsData.app));
        })
        return filteredData;
    }

    getRangeFilteredColumns = (
        analyticsData: AnalyticsNS.IStructuredAnalyticsData[],
        columnRangeFilters: AnalyticsNS.IColumnFilters,
    ) => {
        let updatedRangeFilteredColumns:AnalyticsNS.IStructuredAnalyticsData[] = analyticsData;
        _.map(analyticsData, (eachAnalyticalData) => {
            const validityArray:boolean[] = [] 
            _.map(columnRangeFilters, (eachColumnFilter, key) => {
                if(key!=='app' && eachColumnFilter > 0) {
                    validityArray.push(eachAnalyticalData[key] <= eachColumnFilter);
                }
            });
            if(!_.includes(validityArray, false)){
                updatedRangeFilteredColumns.push(eachAnalyticalData);
            }
        });
        return updatedRangeFilteredColumns;
    }

    setInitialColumnFilters = (
        analyticsData: AnalyticsNS.IState['analyticsData'],
        appsData: APIResponseNS.IEachAppData[],
    ) => {
        const filters:AnalyticsNS.IColumnFilters = {};
        const keys = _.keys(analyticsData[0]); 
        _.map(keys, (eachKey) => {
            if(eachKey!=='app' && eachKey!=='date'){
                filters[eachKey] = 0;
            }else if(eachKey==='app'){
                filters[eachKey] = [...appsData];
            }
        });
        return filters;
    }

    setColumnFilters: AnalyticsNS.IActionCreators['setColumnFilters'] = (
        columnName,
        filterValue,
    ) => async(dispatch, getState) => {
        const analyticsData = _.cloneDeep(getState().Analytics.analyticsData);
        const columnFilters = _.cloneDeep(getState().Analytics.columnFilters);
        if(columnName) { 
            if(typeof filterValue === 'number'){
                columnFilters[columnName] = filterValue;
                let finalUpdatedAppsColumnAnalyticsData:AnalyticsNS.IStructuredAnalyticsData[] = analyticsData;
                if(typeof columnFilters['app'] !== 'number' && columnFilters['app'].length > 0) {
                    finalUpdatedAppsColumnAnalyticsData = this.getFilteredAppsData(
                                                            finalUpdatedAppsColumnAnalyticsData, 
                                                            columnFilters['app']);
                }
                const updatedAnalyticsData = this.getRangeFilteredColumns(finalUpdatedAppsColumnAnalyticsData, columnFilters);
                this.dispatchColumnFilters(dispatch, columnFilters, updatedAnalyticsData);
            }else {
                columnFilters[columnName] = filterValue?filterValue:[];
                const updatedAnalyticsData = this.getFilteredAppsData(analyticsData, filterValue? filterValue:[]);
                const finalFilterRangeUpdatedItems = this.getRangeFilteredColumns(updatedAnalyticsData, columnFilters);
                this.dispatchColumnFilters(dispatch, columnFilters, finalFilterRangeUpdatedItems);
            }
            this.setQueryParams(
                getState().Analytics.startDate,
                getState().Analytics.endDate,
                getState().Analytics.arrangeColumnsData,
                columnFilters,
            );
        }else {
            this.dispatchColumnFilters(
                dispatch, 
                this.setInitialColumnFilters(analyticsData, getState().Analytics.appsAPIData), 
                analyticsData
            );
        }
    };

};

export default new ActionCreators();
