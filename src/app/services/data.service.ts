import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './interfaces/user.config';
import { Invoice, Ambilan } from './interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afs: AngularFirestore,
  ) {
    // this.c().then(() => console.log('TOKO CREATED'));
  }

  // c() { //sampe sini buat list toko
  //   const dataToko = [
  //     {kode: 'denora', nama : 'denora'},
  //     {kode: 'beauty', nama : 'beauty'},
  //     {kode: 'mpmf', nama : 'mpmf'},
  //     {kode: 'fuchia', nama : 'fuchia'},
  //     {kode: 'maritza', nama : 'maritza'},
  //     {kode: 'jelita', nama : 'jelita'},
  //     {kode: 'alila', nama : 'alila'},
  //     {kode: 'alila2', nama : 'alila 2'},
  //     {kode: 'lts', nama : 'lts shofiya'},
  //     {kode: 'shofiyah', nama : 'shofiyah miraa'},
  //     {kode: 'qilla', nama : 'qilla'},
  //     {kode: 'kanza', nama : 'kanza'},
  //     {kode: 'alfa', nama : 'alfa'},
  //     {kode: 'unique', nama : 'unique'},
  //     {kode: 'afka', nama : 'afka'},
  //     {kode: 'ama', nama : 'ama najwa'},
  //     {kode: 'ama2', nama : 'ama najwa 2'},
  //     {kode: 'foyou', nama : 'foyou'},
  //     {kode: 'dj', nama : 'dj fashion'},
  //     {kode: 'anisa', nama : 'anisa'},
  //     {kode: 'abella', nama : 'abella'},
  //     {kode: 'billal', nama : 'billal'},
  //     {kode: 'sf', nama : 'shofiyah fashion'},
  //     {kode: 'aderra', nama : 'aderra'},
  //     {kode: 'fc', nama : 'f collection'},
  //     {kode: 'olive', nama : 'olive shoes'},
  //     {kode: 'nabtik', nama : 'nabtik'},
  //     {kode: 'uwais', nama : 'uwais hijab'},
  //     {kode: 'shafeea', nama : 'shafeea hijab'},
  //     {kode: 'sisters', nama : `sister's hijab`},
  //     {kode: 'spassy', nama : 'spassy'},
  //     {kode: 'en', nama : 'en hijab'},
  //     {kode: 'shafara', nama : 'shafara oval hijab luvis'},
  //     {kode: 'akifa', nama : 'akifa'},
  //     {kode: 'hh', nama : 'hijab hubby'},
  //     {kode: 'ellora', nama : 'ellora'},
  //     {kode: 'bm', nama : 'belanja murah'},
  //     {kode: 'rasepi', nama : 'rasepi'},
  //     {kode: 'svj', nama : 'svj batik'},
  //     {kode: 'ba', nama : 'butik ashanty'},
  //     {kode: 'cla', nama : 'cla hijab'},
  //     {kode: 'intanaka', nama : 'intanaka'},
  //     {kode: 'yusha', nama : 'yusha ilyasa'},
  //     {kode: 'orinawa', nama : 'orinawa'},
  //     {kode: 'orinaura', nama : 'orinaura'},
  //     {kode: 'asta bag', nama : 'asta bag'},
  //     {kode: 'asta kc', nama : 'asta kacamata'},
  //     {kode: 'redea', nama : 'redea hijab'},
  //     {kode: 'zarra', nama : 'zarra'},
  //     {kode: 'najwa', nama : 'najwa hijab'},
  //     {kode: 'vanilla', nama : 'vanilla'},
  //     {kode: 'adore', nama : 'adore'},
  //     {kode: 'edelweis', nama : 'edelweiss'},
  //     {kode: 'panda', nama : 'panda jaket'},
  //     {kode: 'sancaka', nama : 'sancaka'},
  //     {kode: 'dod', nama : 'dod shop'},
  //     {kode: 'juana', nama : 'juana'},
  //     {kode: 'epie', nama : 'epie'}
  //   ];
  //   this.afs.collection('configs').doc('user_config').update({data_toko: dataToko.map(d => ({...d, blacklist: false}))});
  //   const batch = this.afs.firestore.batch();
  //   dataToko.forEach(toko => {
  //     const refToko = this.afs.collection('configs').doc('user_config').collection('data_toko').doc(toko.kode).ref;
  //     batch.set(refToko, { nama: toko.nama, lantai: 0, blok: '', hpKeep: 0, hpDaftar: 0, foto: '', jual: [], active: true });
  //   });
  //   return batch.commit();
  // }

  async createInvoice(user: User, inv: Invoice) {
    // console.log(inv);
    try {
      const batch = this.afs.firestore.batch();
      const keepRef = this.afs.collection('invoice').doc<Invoice>(inv.id).ref;
      batch.set(keepRef, {
        active: true,
        owner: user.uid,
        id: inv.id,
        berat: inv.berat,
        cs: user.username,
        penerima: inv.penerima,
        pengirim: inv.pengirim,
        pesanan: inv.pesanan.map(brg => ({barcode: brg.barcode})),
        status: 'keep',
        waktuOrder: inv.pesanan[0].waktuKeep,
        diskon: 0,
        dicek: false,
        // subtotal: inv.total,
        // kodeUnik: inv.kodeUnik,
        // deposit: 0;
        // tglDibayar: 0,
        // waktuDibayar: number;
        // waktuDicek: number;
        // ekspedisi: Ekspedisi;
      });
      for (const item of inv.pesanan) {
        const ambilanRef = this.afs.collection('ambilan').doc<Ambilan>(item.barcode).ref;
        batch.set(ambilanRef, {
          barcode: item.barcode,
          nama: item.nama,         // nama
          toko: item.toko,
          warna: item.warna,
          hargaBeli: item.hargaBeli,
          waktuKeep: item.waktuKeep,
          waktuPrint: 0,
          penerima: inv.penerima.nama,
          printed: false,
          statusKeep: item.statusKeep         // (fullkeep/diambil/kosong)
          // cs: string;
          // pj: string;             // gudang
          // wktScan: number;
        });
      }
      return batch.commit();
    } catch (err) {
      throw err;
    }
  }

}
