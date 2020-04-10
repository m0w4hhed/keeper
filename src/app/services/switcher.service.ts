import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { Invoice, Ambilan } from './interfaces/invoice';
import { User } from './interfaces/user.config';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwitcherService {

  constructor(
    private data: DataService,
    private storage: StorageService,
  ) { }

  createInvoice(user: User, invoice: Invoice) {
    if (user.activated) {
      return this.data.createInvoice(user, invoice)
    } else {
      return this.storage.createInvoice(invoice);
    }
  }

  getInvoice(user: User, invoiceID: string): Observable<Invoice> {
    if (user.activated) {
      return this.data.getData<Invoice>(`invoice/${invoiceID}`).pipe(
        switchMap(data => {
          const allBarcode = data.pesanan; // .map(item => item.barcode);
          return combineLatest([
            of(data),
            combineLatest(
              allBarcode.map(barcode => {
                return this.data.getData<Ambilan>(`ambilan/${barcode}`);
              })
            )
          ]);
        }),
        map( ([{pesanan, ...inv}, allBarcode]: [Invoice, Ambilan[]]) => {
          // console.log('ALL BCD: ', allBarcode);
          return {
            ...inv,        // as unknown as string[] is a new method
            pesanan: (pesanan as unknown as string[]).map(d => {
              allBarcode = allBarcode.filter(brg => brg);
              console.log('allPesanan: ', allBarcode.filter(brg => brg));
              return allBarcode.filter(brg => brg).find(x => x.barcode === d); // .find(x => x.barcode === d.barcode);
            })
          };
        })
      );
    } else {
      return this.storage.getInvoice(invoiceID);
    }
  }
  getInvoices(user: User) {
    if (user.activated) {
      return this.data.getDatas<Invoice>('invoice', [
        {field: 'owner', comp: '==', value: user.uid},
        {field: 'active', comp: '==', value: true}
      ]).pipe(
        switchMap(data => {
          const allBarcode = [].concat(...data.map(item => {
            return item.pesanan; // .map(bc => bc.barcode);
          }));
          if (!data.length) {return combineLatest([of([] as Invoice[]), of([] as Ambilan[])]); }
          return combineLatest([
            of(data),
            combineLatest(
              allBarcode.map(barcode => {
                return this.data.getData<Ambilan>(`ambilan/${barcode}`);
              })
            )
          ]);
        }),
        map( ([data, allBarcode]: [Invoice[], Ambilan[]]) => {
          // console.log(data, allBarcode);
          return data.map(({pesanan, ...inv}) => {
            return {
              ...inv,        // as unknown as string[] is a new method
              pesanan: (pesanan as unknown as string[]).map(d => {
                allBarcode = allBarcode.filter(brg => brg);
                return allBarcode.find(x => x.barcode === d); // .find(x => x.barcode === d.barcode);
              })
            };
          });
        })
      );
    } else {
      return this.storage.getInvoices();
    }
  }

  getAmbilan(user: User, barcode: string): Observable<Ambilan[]> | Observable<Ambilan> {
    if (user.activated) {
    } else {
      return barcode ? this.storage.getAmbilan(barcode) : this.storage.getAmbilan();
    }
  }

  deleteInvoice(user: User, invoice: Invoice) {
    if (user.activated) {
    } else {
      return this.storage.deleteInvoice(invoice);
    }
  }
  
}
