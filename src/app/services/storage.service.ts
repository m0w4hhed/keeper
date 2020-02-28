import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Invoice, Ambilan } from './interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
    private afs: AngularFirestore,
  ) { }

  async setData(storageName: string, data: any): Promise<any> {
    return this.storage.set(storageName, data);
  }
  getData<T>(storageName: string): Observable<T>   {
    return from(this.storage.get(storageName));
  }
  async addArray(storageName: string, data: any): Promise<any> {
    try {
      const array = await this.storage.get(storageName);
      if (array) {
        array.push(data);
        return this.storage.set(storageName, array);
      } else {
        return this.storage.set(storageName, [data]);
      }
    } catch (err) { throw err; }
  }
  updateArray(storageName: string, data: any): Promise<any> {
    return this.storage.get(storageName).then((array) => {
      if (!array || array.length < 0) {
        return null;
      }
      const newArray = [];
      array.forEach(k => {
        if (k.id === data.id) {
          newArray.push(data);
        } else {
          newArray.push(k);
        }
      });
      return this.storage.set(storageName, newArray);
    });
  }
  deleteArray(storageName: string, id): Promise<any> {
    return this.storage.get(storageName).then((array) => {
      if (!array || array.length < 0) {
        return null;
      }
      const newArray = [];
      array.forEach(k => {
        if (k.id !== id) {
          newArray.push(k);
        }
      });
      return this.storage.set(storageName, newArray);
    });
  }

  createInvoice(invoice: Invoice) {
    console.log('INV: ', invoice);
    try {
      const setData = this.addArray('invoice', invoice);
      const batch = this.afs.firestore.batch();
      invoice.pesanan.forEach(barang => {
        const barangRef = this.afs.doc<Ambilan>(`ambilan/${barang.barcode}`).ref;
        batch.set(barangRef, barang);
      });
      const setAmbilan = batch.commit();
      return Promise.all([setData, setAmbilan]);
    } catch (err) { throw err; }
  }
  getInvoice(): Observable<Invoice[]> {
    return this.getData<Invoice[]>('invoice');
  }
}
