export interface Invoice {
    active: boolean;         // default: true
    owner_id: string;
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
    tglDibayar: number;
    subtotal: number;
    total: number;
    waktuDibayar: number;
    waktuOrder: number;
    waktuDicek: number;
    resi: string;
    printed: boolean;
}
export interface Ambilan {
    owner_id: string;
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
    pj: string;            // keeperboy
    statusKeep: string;    // (fullkeep/diambil/kosong)
    waktuScan: number;
    printed: boolean;
    tglPrint: number;      // YYYYMMDD
}
export interface Pengirim {
    hp: number;
    nama: string;
}
export interface Penerima {
    alamat: string;
    hp: number;
    kab: string;
    kec: string;
    kec_id: string;
    nama: string;
    prov: string;
}
export interface Ekspedisi {
    kurir: string;
    ongkir: number;
    service: string;
}
