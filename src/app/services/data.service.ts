import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';
import { User, DataToko } from './interfaces/user.config';
import { Invoice, Ambilan } from './interfaces/invoice';
import { Observable } from 'rxjs';

/**
 * @param field nama field dari document
 * @param comp comparator string firestore
 * @param value value dari field
 */
export interface Filter {
  field: string;
  comp: WhereFilterOp;
  value: string|number|boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afs: AngularFirestore,
  ) {
  }
  
  getDatas<T>(dbName: string, filter: Filter[], searchMode?: {field: string, search: string}|null, rangeDate?: {from: number, to: number, orderBy: string}|null): Observable<T[]> {
    return this.afs.collection<T>(dbName, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (searchMode) {
        console.log(`[FTR] Search value ${filter[0].value}`);
        const start = searchMode.search.toLowerCase();
        const end = start + '\uf8ff';
        query = query.limit(10).orderBy(searchMode.field).startAt(start).endAt(end);
      } else {
        if (rangeDate) {
          query = query.orderBy(rangeDate.orderBy).startAt(rangeDate.from).endAt(rangeDate.to);
        }
      }
      filter.forEach(f => {
        query = query.where(f.field, f.comp, f.value);
      });
      return query;
    }).valueChanges();
  }
  getData<T>(docPath: string): Observable<T> {
    return this.afs.doc<T>(docPath).valueChanges();
  }

  async getTokoInfo(idToko: string) {
    return (await this.afs.collection('configs').doc('user_config').collection('data_toko').doc(idToko).ref.get()).data() as DataToko;
  }

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
