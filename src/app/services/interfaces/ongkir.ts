export interface Kecamatan {
    subdistrict_id: string;         // kecamatan
    subdistrict_name: string;
    province_id: string;            // provinsi
    province: string;
    city_id: string;                // kota/kab
    city: string;
    type: string;                   // =(kota/kab)
}
export interface Ongkir {
  code: string;
  name: string;
  service: string;
  description: string;
  cost: number;
}
