export interface User {
    uid: string;
    email: string;
    deposit: Number;
    displayName: string;
    photoURL: string;
    username: string;
    hp: number;
    configured: boolean;
    activated: boolean;
}

export interface UserConfig {
    wa_cs: number;
    wa_keeper: number;
    cors_proxy: string;
    graphqlAPI: string;
    key: string;
    tele_reg: string;
}
