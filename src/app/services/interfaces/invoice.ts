export interface Invoice {
    active: boolean;         // default: true
    owner: string;
    id: string;
    berat: number;          // gram
    cs: string;
    dicek: boolean;
    diskon: number;
    ekspedisi: Ekspedisi;
    penerima: Penerima;
    pengirim: Pengirim;
    pesanan: Ambilan[];
    status: string;         // keep, dibayar, dikirim
    total?: number;
    waktuDibayar?: number;
    waktuOrder: number;
    waktuDicek?: number;
    resi?: string;
    printed: boolean;
    biaya_dibayar: boolean;
}
export interface Ambilan {
    owner: string;
    barcode: string;
    biaya_keep: number;
    biaya_dibayar: boolean;
    nama: string;        // nama
    warna: string;
    kode: string;       // (default: '')
    berat: number;
    cs: string;
    hargaBeli: number;
    hargaJual: number;
    waktuKeep: number;
    penerima: string;
    toko: string;
    pj: string;            // kode abang keeper (default: '')
    statusKeep: string;    // (fullkeep/diambil/kosong)
    waktuDiambil: number;   // unix timestamp (default: 0)
    waktuPrint: number;     // unix timestamp (default: 0)
    printed: boolean;
}
export interface Pengirim {
    hp: number;
    nama: string;
}
export interface Penerima {
    alamat: string;
    hp: number;
    kab: string;
    kab_id: string;
    kec: string;
    kec_id: string;
    nama: string;
    prov: string;
    prov_id: string;
}
export interface Ekspedisi {
    kurir: string;
    ongkir: number;
    service: string;
}
