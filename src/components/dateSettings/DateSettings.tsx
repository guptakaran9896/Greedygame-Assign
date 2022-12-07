import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import CommonButton from '../commonButton';
import ArrangeColumns from './ArrangeColumns';
import actionCreators from '../../redux/actionCreators/analytics';

import Settings from '../../images/settings.svg';
import RightArrow from '../../images/rightArrow.svg';

import './DateSettings.css';

const DateSettings = (props: AnalyticsNS.IDateSettingsProps) => {
    
    const [isDisplayColumns, setIsDisplayColumns] = useState(false);

    const dispatch = useDispatch();

    const dispatchActionToSetInitialData = () => {
        dispatch(actionCreators.setInitialData());
    };

    const dispatchActionToSetDates = (startDate: string, endDate: string) => {
        dispatch(actionCreators.setDates(startDate, endDate));
    };

    const dispatchActionToArrangeColumns = (arrangeColumnsData: AnalyticsNS.IArrangeColumns[]) => {
        dispatch(actionCreators.setArrangeColumnsData(arrangeColumnsData));
    };

    useEffect(() => {
        dispatchActionToSetInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSettingsButtonClick = () => {
        if(isDisplayColumns){
            setIsDisplayColumns(false);
        }else {
            setIsDisplayColumns(true);
        }
    };

    const handleOnChangeStartDate = (e:React.ChangeEvent<HTMLInputElement>) => {
        dispatchActionToSetDates(e.target.value, props.endDate);
    };

    const handleOnChangeEndDate = (e:React.ChangeEvent<HTMLInputElement>) => {
        dispatchActionToSetDates(props.startDate, e.target.value);
    };

    return (
        <>
        <div className={'datePickerContainer'}>
            <div className={'datePickerWithArrow'}>
                <input
                    type={'date'}
                    className={'datePicker'}
                    onChange={handleOnChangeStartDate}
                    value = {props.startDate}
                />
                <img src={RightArrow} className={'arrowImage'} alt={'date'}/>
                <input
                    type={'date'}
                    className={'datePicker'}
                    onChange={handleOnChangeEndDate}
                    value={props.endDate} 
                />
            </div>
            <CommonButton
                disabled={props.arrangeColumnsData.length === 0}
                onClick={handleOnSettingsButtonClick}
                buttonStyle={'settingsButton'}
            >
                <img src={Settings} className={'settingsImage'} alt={'settings'}/>
                {'Settings'}
            </CommonButton>
        </div>
        {isDisplayColumns?(
            <ArrangeColumns
                setDisplayArrangeColumns={handleOnSettingsButtonClick}
                setArrangeColumnsData={dispatchActionToArrangeColumns}
                arrangeColumnsData={props.arrangeColumnsData}
            />
        ):(null)}
        </>
    );
};

export default DateSettings;