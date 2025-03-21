export interface zip_codes {
    zip_codes: formatoAPI []
}

export interface formatoAPI {
    id:string;
    d_codigo: number;
    id_asenta_cpcons: string;
    c_cve_ciudad: string;
    c_mnpio: string;

    d_asenta: string;
    d_mnpio: string;
    d_estado: string;
    d_ciudad: string
}

// export interface AutoCompleteInterface {
//     label: string | null
//     value: string | null
//  }