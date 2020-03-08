import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { switchMap, map, filter, find } from 'rxjs/operators';
import { Invoice, Ambilan } from './interfaces/invoice';
import { User } from './interfaces/user.config';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  invoice$ = new BehaviorSubject<Invoice[]>([]);
  ambilan$ = new BehaviorSubject<Ambilan[]>([]);

  constructor(
    private storage: Storage,
    private plt: Platform,
  ) {
    this.plt.ready().then(() => {
      this.updateData();
    });
  }
  updateData() {
    this.storage.get('invoice').then((invoice: Invoice[]) => {
      if (invoice) { this.invoice$.next(invoice); }
    });
    this.storage.get('ambilan').then((ambilan: Ambilan[]) => {
      if (ambilan) { this.ambilan$.next(ambilan); }
    })
  }

  async addArray(storageName: string, data: any): Promise<any> {
    try {
      const isArray = Array.isArray(data);
      let array = await this.storage.get(storageName);
      if (array) {
        isArray ? array = array.concat(data) : array.push(data);
        return this.storage.set(storageName, array).then(() => this.updateData());
      } else {
        return this.storage.set(storageName, (isArray ? data : [data])).then(() => this.updateData());
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
      return this.storage.set(storageName, newArray).then(() => this.updateData());
    });
  }
  deleteArray<T>(storageName: string, key: string, idKey: string|string[]): Promise<any> {
    return this.storage.get(storageName).then((array) => {
      if (!array || array.length < 0) {
        return null;
      }
      const newArray = [];
      if (Array.isArray(idKey)) {
        array.forEach(k => {
          if (idKey.indexOf(k[key]) === -1) { newArray.push(k); }
        });
      } else {
        array.forEach(k => {
          if (k[key] !== idKey) { newArray.push(k); }
        });
      }
      return this.storage.set(storageName, newArray).then(() => this.updateData());
    });
  }

  createInvoice(invoice: Invoice) {
    console.log('[INV] Create: ', invoice);
    try {
      const setData = this.addArray('invoice', invoice);
      const setAmbilan = this.addArray('ambilan', invoice.pesanan);
      return Promise.all([setData, setAmbilan]);
    } catch (err) { throw err; }
  }
  getInvoice(invoiceID?: string): Observable<Invoice[]> | Observable<Invoice> {
    if (invoiceID) {
      return this.invoice$.asObservable().pipe(
        map(inv => inv.find(i => i.id === invoiceID))
      );
    } else {
      return this.invoice$.asObservable();
    }
  }
  getAmbilan(barcode?: string): Observable<Ambilan[]> | Observable<Ambilan> {
    if (barcode) {
      return this.ambilan$.asObservable().pipe(
        map(inv => inv.find(i => i.barcode === barcode))
      );
    } else {
      return this.ambilan$.asObservable();
    }
  }
  deleteInvoice(invoice: Invoice) {
    console.log('[INV] Delete: ', invoice);
    try {
      const delInvoice = this.deleteArray('invoice', 'id', invoice.id);
      const delAmbilan = this.deleteArray('ambilan', 'barcode', invoice.pesanan.map(x => x.barcode));
      return Promise.all([delInvoice, delAmbilan]);
    } catch (err) { throw err; }
  }
}
