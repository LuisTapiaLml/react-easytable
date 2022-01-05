import { useEffect, useState } from "react";

import './easy_table_styles.scss';

export const EasyTable = ({
    data = [],
    pagination = false,
    rowsPerPage = 15,
    orderBy = 0,
    fetchTable = false,
    urlFetch = '',
    fetchInfo = {
        total: 0,
        currentPage: 0,
    },
    updateByFetchFunction = null,
    headersInFirstRow = false,
    tableClases = [],
    customHeaders = []
}) => {

    const [tableValues, setTableValues] = useState({
        data: [],
        currentPage: 0,
        pages: [],
        numPages: 0,
        tableHeaders: [],
        isCheckin: true,
        isPreviousButtonDisabled: true,
        isNextButtonDisables: true,
        dataType: '' ,
        customHeaders : false
    });

    useEffect(() => {

        if (!Array.isArray(data)) {
            throw new Error("data has to be an array");
        }

        if (data.length === 0 && !fetchTable) {
            throw new Error("Data can't be an empty array");
        }

        //carga las paginas en un arreglo
        const paginas = [];
        let encabezados = [];
        let numeroPaginas = 0;
        let tipoData = ''
        let encabezados_personalizados = false;

        // if there's no custom headers
        if (customHeaders.length === 0) {
            if (headersInFirstRow) {

                encabezados = data[0];
                tipoData = 'array';

                data.shift()

            } else {
                // si la data es un arreglo de objetos
                if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
                    encabezados = Object.keys(data[0])
                    tipoData = 'object';
                } else if (Array.isArray(data[0])) {
                    tipoData = 'array';
                    encabezados = data[0];
                }

            }

        } else {
            // custom headers structure
            // {
            //     realRowName : '',
            //     rowNewName : null,
            //     customRenderFunction : null
            // }
            if( customHeaders.length === 0 ){

                throw new Error("custom headers can't be an empty array");

            }else{
                for (let i = 0; i < customHeaders.length; i++) {
                
                    if ('realRowName' in customHeaders[i] ) {
                        encabezados.push(customHeaders[i].realRowName)
                    }else{
                        throw new Error('realRowName key is missing in custom headers at position: ' , i  );
                    }
                    
                }
    
                encabezados_personalizados = true;
            }
    
        }

        for (let i = 0, j = data.length; i < j; i += rowsPerPage) {

            paginas.push(data.slice(i, i + rowsPerPage));

        }

        numeroPaginas = paginas.length;

        setTableValues({
            ...tableValues,
            data: data,
            isCheckin: false,
            pages: paginas,
            numPages: numeroPaginas,
            tableHeaders: encabezados,
            dataType: tipoData,
            customHeaders : encabezados_personalizados, 
            isNextButtonDisables: paginas.length >= 1 ? false : true
        })

    }, [data]);


    const handlePreviousPage = () => {

        const nuevaPagina = tableValues.currentPage - 1
        if (nuevaPagina < 0) {
            return false
        }

        setTableValues({
            ...tableValues,
            currentPage: nuevaPagina,
            isPreviousButtonDisabled: nuevaPagina - 1 < 0 ? true : false,
            isNextButtonDisables: false
        });


        
    }

    const handleNextPage = () => {

        const nuevaPagina = tableValues.currentPage + 1

        if (nuevaPagina >= tableValues.numPages) {
            return false
        }

        setTableValues({
            ...tableValues,
            currentPage: nuevaPagina,
            isNextButtonDisables: nuevaPagina + 1 >= tableValues.numPages ? true : false,
            isPreviousButtonDisabled: false
        })

    }

    return (

        !tableValues.isCheckin &&
        (
            <div className="easytable-container">
                <header className="easytable-header">

                    <div className="easytable-info-wrapper">
                        <p> Pagina : {tableValues.currentPage + 1} de {tableValues.pages.length} </p>
                        <p> Total : {tableValues.data.length}  </p>
                    </div>

                    <div className="easytable-pagination-wrapper">
                        <button
                            disabled={tableValues.isPreviousButtonDisabled && 'disabled'}
                            onClick={handlePreviousPage}
                        >
                            Anterior
                        </button>

                        <button
                            disabled={tableValues.isNextButtonDisables && 'disabled'}
                            onClick={handleNextPage}
                        >
                            Siguiente
                        </button>

                    </div>

                </header>
                <div className="easytable-table-wrapper">
                    <table className={`easytable-table ${tableClases.join(" ")}`} >
                        <thead>
                            <tr>
                                {
                                    tableValues.tableHeaders.length > 0 ?
                                        (
                                            tableValues.tableHeaders.map(header => (
                                                <th key={`th_${crypto.randomUUID()}`}> {header} </th>
                                            ))
                                        ) :
                                        <th> there's no table headers </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableValues.data.length > 0 ?
                                    (
                                        tableValues.pages[tableValues.currentPage].map(row => (
                                            <tr key={`tbody_tr_${crypto.randomUUID()}`} >
                                                {
                                                    tableValues.tableHeaders.map((header, indexHeader) => (

                                                        <td key={`td_${crypto.randomUUID()}`} >
                                                            {

                                                                tableValues.dataType == 'object' ? 
                                                                    row[header] : 
                                                                    row[indexHeader]
                                                            }
                                                        </td>

                                                    ))
                                                }
                                            </tr>
                                        ))
                                    )
                                    :
                                    (
                                        <tr>
                                            <th> there's no table data </th>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )

    )
}

// headers = [
//     {
//         realRowName : '',
//         rowNewName = null ,
//         customRenderFunction = null

//     }
// ]