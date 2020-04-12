export interface Pembayaran {
    id: string;
    invoice: string;
    owner: string;
    dicek: boolean;
    waktu_dibayar: number;
    pesanan?: string[];
    bukti?: string;
    subtotal?: number;
    ongkir?: number;
    total: number;
    type: string;           // pembayaran | pelunasan | deposit
}
