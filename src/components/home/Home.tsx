import React from 'react';
import {useSelector} from 'react-redux';

import DateSettings from '../dateSettings';
import Error from '../error';
import Loader from '../loader';
import Table from './Table';

import './Home.css';

const Home = () => {

    const state:AnalyticsNS.IState = useSelector((
        appState:ReduxNS.IState
    ) => appState.Analytics);

    return (
        <div className={'mainContainer'}>
            <div className={'heading'}>
                {'Analytics'}
            </div>
            <div className={'dateSettingsDisplay'}>
            <DateSettings
                startDate={state.startDate}
                endDate={state.endDate}
                arrangeColumnsData={state.arrangeColumnsData}
            />
            </div>           
            <div className={'tableDisplay'}>
            {state.isLoading ? 
                <Loader/>:state.analyticsData.length > 0 ? 
                <Table
                    analyticalData={state.analyticsData}
                    arrangeColumnsData={state.arrangeColumnsData}
                    appsAPIData={state.appsAPIData}
                    columnFilters={state.columnFilters}
                    analyticDataCopy={state.analyticsDataCopy}
                />:<Error/>}
            </div>
        </div>
    );
};

export default Home
