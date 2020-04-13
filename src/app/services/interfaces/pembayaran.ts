import { Ambilan } from 'src/app/services/interfaces/invoice';

export interface Pembayaran {
    id: string;
    invoice: string;
    owner: string;
    dicek: boolean;
    waktu_dibayar: number;
    pesanan?: Ambilan[];
    bukti?: string;
    subtotal?: number;
    ongkir?: number;
    total: number;
    type: string;           // pembayaran | pelunasan | deposit
}
