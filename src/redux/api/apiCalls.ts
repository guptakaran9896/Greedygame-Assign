import axios, {AxiosResponse} from 'axios';

import {url} from './url';

export const getAnalyticsData = (
    startDate?: string,
    endDate?: string,
):Promise<AxiosResponse<APIResponseNS.IAnalyticsAPIResponseData>> => {
    return axios.get(
        `${url}/report?startDate=${startDate}&endDate=${endDate}`,
        {
            timeout: 10000,
        }
    );
};

export const getAppsData = (
):Promise<AxiosResponse<APIResponseNS.IAppsAPIResponse>> => {
    return axios.get(
        `${url}/apps`,
        {
            timeout: 10000,
        }
    );
};