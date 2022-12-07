import React from 'react';
import _ from 'lodash';

import './CommonTable.css';

const CommonTable = (props: CommonComponentsNS.ICommonTableProps) => {
    return (
        <table>
            <tbody>
            <tr>
            {_.map(props.columns, (eachColumn, key) => {
                return (
                    <th key={key} className={eachColumn.className}>
                        {eachColumn.colName}
                    </th>
                );
            })}
            </tr>
            {_.map(props.data, (eachData, index) => {
                return (
                    <tr key={index}>
                        {_.map(props.columns, (eachColumn, newKey) => {
                            return (
                                <td key={newKey} className={eachColumn.className}>
                                    {eachColumn.render ? 
                                        eachColumn.render(eachData):
                                        eachData[eachColumn.keyToSearch]}
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

export default CommonTable;