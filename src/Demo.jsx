import React, { useEffect, useMemo, useState } from 'react';
import { EasyTable } from './components/EasyTable/EasyTable';
import { getJsonData } from './selectors/getArrayData';
import { getArrayData } from './selectors/getJsonData';


const customHeaders = [
    {
        realRowName: '',
        rowNewName: null,
        customRenderFunction: null
    }
]

export const Demo = () => {

    const [data, setData] = useState({
        json_data: [],
        array_data: []
    })

    useEffect(() => {

        const my_json_data = getJsonData();
        const my_array_data = getArrayData();

        setData({
            ...data,
            json_data: my_json_data,
            array_data: my_array_data
        });

    }, [])

    return (
        <div>
            {
                data.json_data.length > 0 &&
                (
                    <EasyTable
                        data={data.json_data}
                        tableClases={["table-json-data"]}
                    />
                )

            }{
                data.array_data.length > 0 &&
                (
                    <EasyTable
                        data={data.array_data}
                        tableClases={["table-array-data"]}
                        headersInFirstRow={true}
                    />
                )
            }
        </div>
    )
}

