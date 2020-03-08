import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { Invoice, Ambilan } from './interfaces/invoice';
import { User } from './interfaces/user.config';
import { Observable } from 'rxjs';

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
  getInvoice(user: User, invoiceID?: string): Observable<Invoice> | Observable<Invoice[]> {
    if (user.activated) {
    } else {
      return invoiceID ? this.storage.getInvoice(invoiceID) : this.storage.getInvoice();
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
