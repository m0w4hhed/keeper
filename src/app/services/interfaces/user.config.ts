export interface User {
    uid: string;
    email: string;
    displayName: string;
    deposit: number;
    photoURL: string;
    username: string;
    hp: number;
    configured: boolean;
    activated: boolean;
}

export interface UserConfig {
    biaya_keep: number;
    cors_proxy: string;
    data_berat: {
        type: string;
        berat: number;
    }[];
    data_toko: string[];
    data_toko_blacklist: string[];
    graphqlAPI: string;
    key: string;
    tele_reg: string;
    wa_admin: number;
    wa_cs: number;
    wa_keeper: number;
}

export interface DataToko {
    active: boolean;
    blok: string;
    foto: string;
    hpDaftar: number;
    hpKeep: number;
    jual: string[];
    kode: string;
    lantai: number;
    nama: string;
    no: string;
}
