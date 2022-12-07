import React, {useState} from "react";

import Search from "../search";
import InputRange from "./InputRange";

import './Home.css';

import Filter from '../../images/filter.svg';

const TableHeader = (props:CommonComponentsNS.TableHeader) => {

    const [displayFilter, setDisplayFilter] = useState(false)   ;

    const handleOnClick = () => {
        if(displayFilter){
            setDisplayFilter(false);
        }else {
            setDisplayFilter(true);
        }
    };
    
    const setFilterValue = (filterValue: APIResponseNS.IEachAppData[] | number) => {
        handleOnClick();
        if(props.onChangeFilterValue){
            props.onChangeFilterValue(props.columnName, filterValue);
        };
    };

    return (
        <div className={`tableHeader ${props.className}`}>
            <img src={Filter} alt={'Filter'} onClick={handleOnClick}/>
            {props.headerName}
            <div className={'summaryText'}>
                {props.totalText}
            </div>
            {displayFilter && props.filterType === 'search' && 
                <Search
                    data={props.appsAPIData?props.appsAPIData:[]}
                    keyToSearch={'app_name'}
                    onSearch={setFilterValue}
                />
            }
            {displayFilter && props.filterType==='range' && 
                <InputRange
                    value={props.filterValue?props.filterValue:0}
                    maxValue={props.maxValue?props.maxValue:0}
                    minValue={props.minValue?props.minValue:0}
                    onApplyFilter={setFilterValue}
                />
            }
        </div>
    );
};

export default TableHeader;