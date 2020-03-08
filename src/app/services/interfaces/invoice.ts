export interface Invoice {
    active: boolean;         // default: true
    owner: string;
    id: string;
    kodeUnik: number;
    berat: number;          // gram
    cs: string;
    dicek: boolean;
    deposit: number;
    hutang: number;
    diskon: number;
    ekspedisi: Ekspedisi;
    penerima: Penerima;
    pengirim: Pengirim;
    pesanan: Ambilan[];
    status: string;         // keep, dibayar, dikirim
    subtotal: number;
    total: number;
    waktuDibayar: number;
    waktuOrder: number;
    waktuDicek: number;
    resi: string;
    printed: boolean;
}
export interface Ambilan {
    owner: string;
    barcode: string;
    nama: string;        // nama
    warna: string;
    berat: number;
    cs: string;
    hargaBeli: number;
    hargaJual: number;
    waktuKeep: number;
    penerima: string;
    toko: string;
    pj: string;            // kode abang keeper
    statusKeep: string;    // (fullkeep/diambil/kosong)
    waktuDiambil: number;   // unix timestamp
    waktuPrint: number;     // unix timestamp
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
