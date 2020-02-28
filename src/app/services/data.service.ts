import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService, User } from './user.service';
import { Observable } from 'rxjs';
import { UserConfig } from './interfaces/user.config';
import { Invoice, Ambilan } from './interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  user: User; task;

  userConfig: Observable<UserConfig>;
  // sharedConfig: Observable<SharedConfig>;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
  ) {
    this.task = this.userService.user$.subscribe(res => {
      console.log('[DATA] Get User Data');
      this.user = res
    });
    this.getConfigs();
  }
  getConfigs() {
    console.log('[DATA] Observe User Config');
    this.userConfig = this.afs.doc<UserConfig>(`configs/user_config`).valueChanges();
    // this.sharedConfig = this.afs.doc<SharedConfig>(`configs/user_config_share`).valueChanges();
  }

  c() { //sampe sini buat list toko
    const dataToko = [
      {kode: 'LTS', nama : 'SHOFIYA'},
      {kode: 'KANZA', nama : 'KANZA'},
      {kode: 'ALILA', nama : 'ALILA'},
      {kode: 'ALILA 2', nama : 'ALILA 2'},
      {kode: 'AKIFA', nama : 'AKIFA'},
      {kode: 'HH', nama : 'HIJAB HUBBY'},
      {kode: 'ELLORA', nama : 'ELLORA'},
      {kode: 'MARITZA', nama : 'MARITZA'},
      {kode: 'UWAIS', nama : 'UWAIS'},
      {kode: 'BM', nama : 'BELANJA MURAH'},
      {kode: 'JELITA', nama : 'JELITA'},
      {kode: 'RASEPI', nama : 'RASEPI'},
      {kode: 'SVJ', nama : 'SVJ BATIK'},
      {kode: 'BA', nama : 'BUTIK ASHANTY'},
      {kode: 'CLA', nama : 'CLA HIJAB'},
      {kode: 'INTANAKA', nama : 'INTANAKA'},
      {kode: 'YUSHA', nama : 'YUSHA ILYASA'},
      {kode: 'ORINAWA', nama : 'ORINAWA'},
      {kode: 'ORINAURA', nama : 'ORINAURA'},
      {kode: 'ASTA BAG', nama : 'ASTA BAG'},
      {kode: 'ASTA KC', nama : 'ASTA KACAMATA'},
      {kode: 'REDEA', nama : 'REDEA HIJAB'},
      {kode: 'ZARRA', nama : 'ZARRA'},
      {kode: 'NAJWA', nama : 'NAJWA HIJAB'},
      {kode: 'VANILLA', nama : 'VANILLA'},
      {kode: 'ADORE', nama : 'ADORE'},
      {kode: 'EDELWEIS', nama : 'EDELWEISS'},
      {kode: 'SPASSY', nama : 'SPASSY'},
      {kode: 'PANDA', nama : 'PANDA JAKET'},
      {kode: 'UNIQUE', nama : 'UNIQUE'},
      {kode: 'SANCAKA', nama : 'SANCAKA'},
      {kode: 'DOD', nama : 'DOD SHOP'},
      {kode: 'JUANA', nama : 'JUANA'},
      {kode: 'EPIE', nama : 'EPIE'}
    ];
    this.afs.collection('configs').doc('user_config_share').set({data_toko: dataToko})
  }

  async createInvoice(inv: Invoice) {
    // console.log(inv);
    try {
      const batch = this.afs.firestore.batch();
      const keepRef = this.afs.collection('invoice').doc<Invoice>(inv.id).ref;
      batch.set(keepRef, {
        active: true,
        owner_id  : this.user.uid,
        id: inv.id,
        berat: inv.berat,
        cs: this.user.username,
        penerima: inv.penerima,
        pengirim: inv.pengirim,
        pesanan: inv.pesanan,
        status: 'keep',
        subtotal: inv.total,
        waktuOrder: inv.pesanan[0].waktuKeep,
        kodeUnik: inv.kodeUnik,
        diskon: 0,
        dicek: false,
        // deposit: 0;
        // ekspedisi: Ekspedisi;
        // tglDibayar: 0,
        // waktuDibayar: number;
        // waktuDicek: number;
      });
      for (const item of inv.pesanan) {
        const ambilanRef = this.afs.collection('ambilan').doc<Ambilan>(item.barcode).ref;
        batch.set(ambilanRef, {
          barcode: item.barcode,
          barang: item.nama,         // nama
          toko: item.toko,
          warna: item.warna,
          hargaBeli: item.hargaBeli,
          waktuKeep: item.waktuKeep,
          penerima: inv.penerima.nama,
          printed: false,
          tglPrint: 0,
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

  onDestroy() {
    this.task.unsubscribe();
  }

}
