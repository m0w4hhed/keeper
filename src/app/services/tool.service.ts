import { User } from 'src/app/services/interfaces/user.config';
import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Invoice, Penerima, Pengirim, Ambilan } from './interfaces/invoice';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
// import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private userService: UserService,
    private iab: InAppBrowser,
    private clipboard: Clipboard,
    // private appVersion: AppVersion,
  ) {}

  baca(teks: string, user: User) {
    teks = teks.replace(/\r?\n|\r/gi, '\n').toLowerCase();
    let result: {data?: Invoice, error?: string};
    let error = []; let ercode = null;

    const inv = {} as Invoice;
    let splitText;
    teks.split('keep').length > 1 ? splitText = teks.split('keep') : splitText = ['', ''];
    inv.id = this.getTime() + '-' + this.uid(2, {alphabetMode: true, mixResult: true});
    // inv.kodeUnik = +this.uid(3);
    inv.waktuOrder = this.getTime();
    inv.status = 'keep';
    inv.active = true;
    inv.biaya_dibayar = false;
    inv.dicek = false;
    inv.diskon = 0;
    inv.berat = 0;
    inv.owner = user.uid;
    inv.cs = user.username;

    // getPenerima
    const penerima = {} as Penerima;
    const tex = splitText[0];
    let errorPenerima = false;
    // tslint:disable-next-line: max-line-length
    if (tex.match(/nama:/gi)) { penerima.nama = this.regexx(tex, 'nama:', '\n').replace(/[^a-z A-Z.,()t]/g, '').trim();
    } else { ercode = '2.nama'; errorPenerima = true; }
    if (tex.match(/alamat:/gi)) { penerima.alamat = this.regexx(tex, 'alamat:', 'kec.').trim();
    } else { ercode = '2.alamat'; errorPenerima = true; }
    if (tex.match(/kec./gi)) {
      if (tex.match(/kab/gi)) { penerima.kec = this.regexx(tex, 'kec.', 'kab.').replace(/[^A-Z a-z]/g, '').trim();
      } else { ercode = '2.kabupaten'; errorPenerima = true; }
    } else { ercode = '2.kecamatan'; errorPenerima = true; }
    if ( tex.match(/hp:/gi) && this.formatHp(this.regexx(tex, 'hp:', '\n')) ) {
      penerima.hp = this.formatHp(this.regexx(tex, 'hp:', '\n'));
    } else { ercode = '2.hp'; errorPenerima = true; }
    if (errorPenerima) { inv.penerima = {} as Penerima; } else { inv.penerima = penerima; }
    // getPenerima

    // getPengirim
    const pengirim = {} as Pengirim;
    if (tex.match(/pengirim/gi) ) {
      const sender = this.regexx(tex, 'pengirim:', '$').split('\n');
      pengirim.nama = sender[0].trim();
      pengirim.hp = this.formatHp(sender[1]);
    }
    inv.pengirim = pengirim;
    // getPengirim

    // getBarang
    if (splitText[1]) {
      const result = this.getBarang(splitText[1], inv)
      if (!result.error) {
        inv.pesanan = result.listBarang;
      } else { ercode = result.error; }
    } else {
      ercode = '0.0';
    }
    // getBarang

    if (ercode) { error = ercode.split('.'); }
    // if (inv.pemesan == null) {
    //   result = { error: 'maaf, id dropshiper tidak ditemukan'};
    // } else
    if ( error[0] === '0' ) {
      result = { error: 'Format input order salah!' };
    } else if ( error[0] === '1' ) {
      result = { error: error[1] };
    } else if ( error[0] === '2' ) {
        result = { error: `Format ${error[1]} penerima salah!`};
    } else {
      result = { data: inv};
    }
    return result;
  }
  regexx(teks: string, awal: string, akhir: string) {
    const key = new RegExp(`(?<=${awal})([^]+?)(?=${akhir})`, 'gi');
    const result = teks.match(key);
    if (result) {
      return result[0].toString().trim();
    } else { return ''; }
  }
  getBarang(keep: string, inv: Invoice) {
    const USER_CONFIG = this.userService.user_config$.value;
    const listBarang: Ambilan[] = [];
    let error = null;
    let message = '';
    const lis = keep.replace(/[^0-9a-zA-Z ,-/\n]/g, '').trim().split('\n');
    lis.forEach((data, i) => {
      const datas = data.split(',');
        // nama, warna, toko, hargaBeli, jumlah
        if (datas.length === 5) {
          const toko = datas[2].trim().toLowerCase();
          const jumlah = +datas[4].replace(/[^0-9]/g, '');
          const hargaBeli = +datas[3].replace(/[^0-9]/g, '');
          // validasi toko
          if (!USER_CONFIG.data_toko.includes(toko)) {
            error = true;
            message = `barang ke-${i + 1} toko ${toko} belum didukung`; 
          };
          if (USER_CONFIG.data_toko_blacklist.includes(toko)) {
            error = true;
            message = `barang ke-${i + 1} toko ${toko} masuk daftar hitam kami`; 
          };
          if (!jumlah) { error = true; message = `jumlah barang no ${i + 1} tidak valid`; }
          if (!hargaBeli) { error = true; message = `harga beli no ${i + 1} tidak valid`; }
          if (!error) {
            for (let x = 1; x <= jumlah; x++) {
              const ambilan: Ambilan = {
                biaya_keep: USER_CONFIG.biaya_keep,
                biaya_dibayar: false,
                owner: inv.owner,
                cs: inv.cs,
                pj: '',
                waktuDiambil: 0,
                waktuPrint: 0,
                printed: false,
                barcode : inv.id + this.uid(2, {alphabetMode: true, mixResult: true}),
                berat: this.hitungBerat(datas[0].trim()),
                penerima: inv.penerima.nama,
                hargaBeli: hargaBeli * 1000,
                hargaJual: 0,
                nama: datas[0].trim().toLowerCase(),
                warna: datas[1].trim().toLowerCase(),
                kode: '',
                toko,
                statusKeep: 'keep',
                waktuKeep: this.getTime()
              };
              // inv.subtotal += ambilan.hargaJual;
              inv.berat += ambilan.berat;
              // console.log(ambilan);
              listBarang.push(ambilan);
            }
          } else { error = `1.${message}`; } // error jika toko bermasalah
        } else { error = `1.format keep barang no ${i + 1} salah!`; }
    });
    return {error, listBarang};
  }
  hitungBerat(nama: string) {
    const USER_CONFIG = this.userService.user_config$.value;
    let berat = 500; // default berat 500gr
    USER_CONFIG.data_berat.forEach((data) => {
      if ( !!nama.match(new RegExp(`\\b${data.type}\\b`, 'gi')) ) {
        berat = data.berat;
      }
    });
    return berat;
  }

  formatNama(teks: string) {
    const nama = teks.split(' ');
    let jeneng = teks;
    if (nama.length > 2) {
      // console.log(nama[0] + ' ' + nama[1]);
      jeneng = nama[0];
      nama.forEach((item, i) => {
        if (i !== 0 && i !== (nama.length - 1)) {
          jeneng += ` ${nama[i][0]}.`;
        }
      });
      jeneng += ` ${nama[nama.length - 1]}`;
    }
    return jeneng;
  }

  formatHp(no: any) {
    if (no) {
      let fn = no.replace(/[^0-9]/g, '');
      if (fn.length < 14) {
        if ( fn.charAt(0) === '0') { fn = fn.substring(1); }
        return +('62' + fn);
      } else { return null; }
    }
  }

  getTime(format?: string) {
    if (format) {
      return +moment().format(format);
    } else {
      return moment().unix();
    }
  }

  uid(pjg: number, options?: {alphabetMode: boolean, mixResult?: boolean}) {
    const numbs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // tslint:disable-next-line: max-line-length
    const words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const mix = words.concat(numbs.map(x => x.toString()));
    let source = [];
    if (options) {
      if (options.alphabetMode) {
        if (options.mixResult) { source = mix; } else { source = words; }
      } else { source = numbs; }
    } else { source = numbs; }
    let n;
    const result = [];
    for (n = 1; n <= pjg; ++n) {
      const i = Math.floor((Math.random() * (source.length - n)) + 1);
      result.push(source[i]);
      source[i] = source[source.length - n];
    }
    let uid = '';
    for (let i = 0; i < pjg; i++) {
       uid += result[i] + '';
    }
    return uid;
  }

  titleCase(str: string) {
    if (str) {
      return str.toLowerCase().split(' ').map((word) => {
        if (word[0]) {
          return word.replace(word[0], word[0].toUpperCase());
        } else { return ''; }
      }).join(' ');
    } else { return ''; }
  }

  olahPesanan(invoice: Invoice) {
    let subtotalBarang = 0;
    let biayaKeep = 0;
    let belumTotalan = false;
    let beratPaket = 0;
    let margin = 0;
    invoice.pesanan.forEach(barang => {
      biayaKeep += barang.hargaBeli + barang.biaya_keep;
      subtotalBarang += barang.hargaJual;
      if (barang.hargaJual === 0) { belumTotalan = true; }
      beratPaket += barang.berat;
      margin += barang.hargaJual - (barang.hargaBeli + barang.biaya_keep);
    });
    if (margin < 0) { margin = 0; }
    if (invoice.ekspedisi) {
      // biayaKeep += invoice.ekspedisi.ongkir;
    } else { biayaKeep = 0; }
    return { biayaKeep, subtotalBarang, belumTotalan, beratPaket, margin };
  }

  cssBarang(barang: Ambilan) {
    let icon = 'search-circle';
    let color = 'dark';
    if (barang) {
      if (barang.statusKeep === 'kosong') { icon = 'close-circle'; color = 'danger'; }
      if (barang.printed) { icon = 'print'; color = 'tertiary'; }
      if (barang.statusKeep === 'diambil') { icon = 'checkmark-circle'; color = 'success'; }
    }
    return { icon, color }
  }
  
  /**
  * Number.prototype.format(n, x)
  *
  * @param integer n: length of decimal
  * @param integer x: length of sections
  *
  * @example
  * formatUang(12345);            // "12,345"
  * formatUang(12345, 2);         // "12,345.00"
  * formatUang(123456.7, 3, 2);   // "12,34,56.700"
  * formatUang(123456.789, 2, 4); // "12,3456.79"
  */
  formatUang(nominal: number, n?, x?) {
    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    // tslint:disable-next-line: no-bitwise
    return nominal.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  }

  kontak(type: string) {
    let phone = '', text = '';
    const { wa_admin, wa_cs, wa_keeper } = this.userService.user_config$.value;
    if (type === 'cs') { phone = wa_cs.toString(); text = 'Hai kak, mau tanya aplikasi dong'; }
    if (type === 'admin') { phone = wa_admin.toString(); text = 'Hai kak admin, mau tanya pembayaran dong'; }
    if (type === 'keeper') { phone = wa_keeper.toString(); text = 'Hai kak keeper, mau tanya barang dong'; }
    this.iab.create(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_system');
  }
  wa(phone: string, text: string) {
    this.iab.create(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_system');
  }

  // getApp() {
  //   const appName = this.appVersion.getAppName();
  //   const appPackageName = this.appVersion.getPackageName();
  //   const appVersionCode = this.appVersion.getVersionCode();
  //   const appVersion = this.appVersion.getVersionNumber();
  //   return { appName, appPackageName, appVersionCode, appVersion }
  // }

  copy(text: string) { return this.clipboard.copy(text); }
  paste() { return this.clipboard.paste(); }

}
