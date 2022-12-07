import _ from 'lodash';
import React, {useState, useCallback, useEffect} from 'react';

import CommonButton from '../commonButton';

import './Search.css';

const Search = (props: CommonComponentsNS.ISearchProps) => {

    const [inputValue, setInputValue] = useState('');
    const [selectedItems, changeSelectedItems] = useState<string[]>([]);
    const [searchItems, setSearchItems] = useState<CommonComponentsNS.IData[]>([]);

    useEffect(() => {
        setSearchItems(props.data);
    }, [props.data]);

    const handleOnClickApply = () => {
        const finalSelectedItems = _.map(selectedItems, (eachSelectedItemID) => {
            const getItem = _.find(props.data, {app_id: eachSelectedItemID});
            if(getItem){
                return getItem;
            }
        });
        if(finalSelectedItems.length > 0) {
            props.onSearch(finalSelectedItems)
        }else {
            props.onSearch(props.data);;
        } 
    };

    const searchItemClassName = (searchItemID: string) => {
        if(_.includes(selectedItems, searchItemID)){
            return 'searchItem searchItemActive';
        }else {
            return 'searchItem'
        }
    };

    const search = (value:string, data:CommonComponentsNS.IData) => {
        const filteredData = _.filter(data, (eachAppsData) => {
            return _.includes(_.toLower(eachAppsData[props.keyToSearch]), _.toLower(value));
        });
        return filteredData;
    };

    const searchDebounceFunction = useCallback(_.debounce(
        (value:string)=>{
            const searchedData = search(value, props.data);
            setSearchItems(searchedData);
    },400),[props.data]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        searchDebounceFunction(e.target.value);
    };  

    const handleOnClickItem = (itemID:string) => {
        const newSelectedItems = [...selectedItems];
        if(!_.includes(selectedItems, itemID)){
            newSelectedItems.push(itemID);
            changeSelectedItems(newSelectedItems);
        }else {
            const updatedSelectedItems = _.filter(newSelectedItems, (eachSelectedItem)=>{
                return eachSelectedItem !== itemID;
            });
            changeSelectedItems(updatedSelectedItems);
        }
    };

    return (
        <div className={'searchContainer'}>
            <div className={'inputBoxContainer'}>
                <input
                    type={'text'}
                    className={'searchInputBox'}
                    placeholder={'Search'}
                    value={inputValue}
                    onChange={handleOnChange}
                />
            </div>
            <div className={'searchContentContainer'}>
            {_.map(searchItems, (eachSearchItem) => {
                return (
                    <div 
                        className={`${searchItemClassName(eachSearchItem.app_id)}`}
                        onClick={() => handleOnClickItem(eachSearchItem.app_id)}
                        key={eachSearchItem.app_id}
                    >
                        {eachSearchItem.app_name}
                        <div className={'searchItemContent'}>
                            {eachSearchItem.app_id}
                        </div>
                    </div>
                );
            })}
            </div>      
            <div className={'buttonsContainer'}>
                <CommonButton
                    disabled={false}
                    onClick={handleOnClickApply}
                    name={'Apply'}
                />
            </div>
        </div>
    )
};

export default Search;