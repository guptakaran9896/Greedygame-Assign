import React, {useState, useRef, useEffect} from 'react';
import _ from 'lodash';

import CommonButton from '../commonButton';

import './DateSettings.css';


const ArrangeColumns = (props: AnalyticsNS.IArrangeColumnsProps) => {
    
    const [list, setList] = useState<AnalyticsNS.IArrangeColumns[]>([]);
    
    useEffect(() => {
        setList(props.arrangeColumnsData);
    }, [props.arrangeColumnsData]);

    const [dragging, setDragging] = useState(false);
    const dragItem = useRef<number | null>(null);

    const handleOnDragStart = (e:React.DragEvent<HTMLDivElement>, index: number) => { 
        dragItem.current = index;
        setTimeout(() => {
            setDragging(true);
        });
    };

    const handleDragEnd = () => {
        setDragging(false);
        dragItem.current = null;
    };

    const handleDragEnter = (e:React.DragEvent<HTMLDivElement>, index: number) => {
        if(dragging && dragItem.current!==null && index !== dragItem.current){
            let newList = [...list];    
            newList.splice(index, 0, ...newList.splice(dragItem.current, 1));
            setList(newList);
            dragItem.current = index;
        }
    }

    const handleOnClickApply = () => {
        props.setArrangeColumnsData(list);
        props.setDisplayArrangeColumns(false);
    }

    const getDragItemClass = (index: number) => {
        if(list[index].isDisplay){
            return index === dragItem.current ? 'listItemSelected listItem' : 'listItem'; 
        }else {
            return index === dragItem.current ? 
                    'listItemSelected listItem listItemUnSelected' : 
                    'listItem listItemUnSelected';
        }
    }

    const handleOnClick = (index:number) => {
        const nonEditableColumns = ['app', 'date'];
        let newList = _.cloneDeep(list);
        if(!(_.includes(nonEditableColumns, newList[index].name))){
            newList[index].isDisplay = newList[index].isDisplay?false:true;
            setList(newList);
        }
    }
    
    return (
        <div className={'listContainer'}>
            <div className={'list'}>    
            {_.map(list, (eachListItem, index) => {
                return (
                    <div 
                        className={getDragItemClass(index)}
                        draggable
                        onDragStart={(e) => handleOnDragStart(e, index)}
                        onDragEnter={(e) => {handleDragEnter(e, index)}}
                        onDragEnd={handleDragEnd}
                        key={index}
                        onClick={() => handleOnClick(index)}
                    >
                        {_.startCase(eachListItem.name)}
                    </div>
                )
            })}  
            </div>
            <div className={'applySettingsButtonsContainer'}>
                <CommonButton
                    name={'Close'}
                    onClick={props.setDisplayArrangeColumns}
                    disabled={false}
                    buttonStyle={'cancelButton'}
                />
                <CommonButton
                    name={'Apply Settings'}
                    onClick={handleOnClickApply}
                    disabled={_.isEqual(list, props.arrangeColumnsData)}
                />
            </div>
        </div>
    )
};

export default ArrangeColumns;
