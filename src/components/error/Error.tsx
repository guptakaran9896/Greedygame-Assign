import React from 'react';

import './Error.css';

import EmptyImage from '../../images/emptyData.svg'

const Error = () => {
    return (
        <div className={'errorContainer'}>
            <img src={EmptyImage} className={'image'} alt={'EmptyImage'}/>
            <div className={'contentDisplay'}>
                <div className={'contentBold'}>
                    {'Hey! Something’s off!'}<br/>
                    {'We couldn’t display the given data.'}
                </div>
                <div className={'contentLight'}>
                    {'Try changing your your filters or selecting a different date.'}
                </div>    
            </div>
        </div>
    )
};

export default Error;