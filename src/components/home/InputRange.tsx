import React, {useEffect,useState} from 'react';

import CommonButton from '../commonButton';

import './Home.css';

const InputRange = (props: CommonComponentsNS.InputRangeProps) => {

    useEffect(() => {
        if(props.value === 0){
            setInputRange(props.minValue);
        }else {
            setInputRange(props.value);
        }
    }, [props.value, props.minValue]);

    const [inputRange, setInputRange] = useState(0);

    const handleOnInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputRange(parseInt(e.target.value));
    };

    const handleOnClickApply = () => {
        props.onApplyFilter(inputRange);
    };

    const handleOnClickReset = () => {
        setInputRange(props.maxValue);
        props.onApplyFilter(props.maxValue);
    };

    return (
        <div className={'inputRangeContainer'}>        
            <div className={'inputContainer'}>  
                <input
                    type={'range'}
                    max={props.maxValue}
                    min={props.minValue}        
                    value={inputRange}
                    onChange={handleOnInput}
                    className={'inputRange'}
                />
                <div className={'inputRanges'}>
                    {props.minValue}
                    <div>
                        {inputRange}
                    </div>
                </div>
            </div>
            <div className={'inputRangeButtonsContainer'}>
                <CommonButton
                    disabled={false}
                    onClick={handleOnClickReset}
                    name={'Reset'}
                    buttonStyle={'resetButton'}
                />
                <CommonButton
                    disabled={false}
                    onClick={handleOnClickApply}
                    name={'Apply'}
                />
            </div>
        </div>
    );
};

export default InputRange;