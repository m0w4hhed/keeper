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

  async getTokoInfo(idToko: string) {
    return (await this.afs.collection('configs').doc('user_config').collection('data_toko').doc(idToko).ref.get()).data() as DataToko;
  }

  async createInvoice({pesanan, ...inv}: Invoice) {
    // console.log(inv, pesanan);
    try {
      const batch = this.afs.firestore.batch();
      const keepRef = this.afs.collection('invoice').doc<Invoice>(inv.id).ref;
      batch.set(keepRef, {
        pesanan: pesanan.map(brg => brg.barcode),
        ...inv
      });
      for (const item of pesanan) {
        const ambilanRef = this.afs.collection('ambilan').doc<Ambilan>(item.barcode).ref;
        batch.set(ambilanRef, item);
      }
      return batch.commit();
    } catch (err) {
      throw err;
    }
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
  setData(path: string, partialData: object) {
    return this.afs.doc(path).set(partialData, {merge: true});
  }
  setDatas(data: {path: string, partialData?: object, delete?: boolean}[]) {
    const batch = this.afs.firestore.batch();
    data.forEach(d => {
      if (!d.delete) {
        batch.set(this.afs.doc(d.path).ref, d.partialData, {merge: true});
      } else {
        batch.delete(this.afs.doc(d.path).ref);
      }
    });
    return batch.commit()
  }

}
