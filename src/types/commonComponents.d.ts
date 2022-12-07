declare namespace CommonComponentsNS {

    interface ICommonButtonProps {
        disabled: boolean;
        onClick: (...args:any) => void;
        buttonStyle?: string; 
        name?: string;
        isLoading?: boolean;
    }

    interface IColumnsStructure {
        colName: string | React.ReactNode;
        keyToSearch: string;
        className?: string;
        render?: (...args:any) => React.ReactNode;
    }

    interface ICommonTableProps {
        columns: IColumnsStructure[];
        data: any;
    }

    interface IData {
        [key:string]: any
    }

    interface ISearchProps {
        data: IData[],
        keyToSearch: string;
        onSearch: (...args:any) => void;
    }

    type Filter = 'search' | 'range';

    interface TableHeader {
        headerName: string;
        totalText: string | number;
        className?: string;
        filterType?: Filter;
        filterValue?: number;
        columnName: string;
        appsAPIData?: APIResponseNS.IEachAppData[];
        onChangeFilterValue?: (...args:any) => void;
        maxValue?: number;
        minValue?: number;
    } 

    interface InputRangeProps {
        maxValue: number;
        value: number;
        onApplyFilter: (...args:any) => void;
        minValue: number
    }

}