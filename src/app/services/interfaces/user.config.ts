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
    cors_proxy: string;
    data_toko: {
        blacklist: boolean;
        kode: string;
        nama: string;
    }[];
    graphqlAPI: string;
    key: string;
    tele_reg: string;
    wa_cs: number;
    wa_keeper: number;
}
