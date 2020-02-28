import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DataService } from './data.service';
import { Invoice, Penerima, Pengirim, Ambilan } from './interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  dataBerat = [
    /* default 500
    {nama: 'dress', berat : 500},
    {nama: 'tas', berat : 500},
    {nama: 'bag', berat : 500},
    {nama: 'maxi', berat : 500},
    {nama: 'overall', berat : 500},
    {nama: 'kids', berat : 500},
    {nama: 'gown', berat : 500},
    {nama: 'jeans', berat : 500}, */
    {nama: 'tunic', berat : 350},
    {nama: 'tunik', berat : 350},
    {nama: 'koko', berat : 250},
    {nama: 'syari', berat : 800},
    {nama: 'set', berat : 1000},
    {nama: 'turki', berat : 800},
    {nama: 'kerudung', berat : 300},
    {nama: 'dompet', berat : 250},
    {nama: 'kacamata', berat : 150},
    {nama: 'couple', berat : 1200},
    {nama: 'mukena', berat : 800},
    {nama: 'kemeja', berat : 250},
    {nama: 'top', berat : 350},
    {nama: 'jaket', berat : 800},
    {nama: 'jacket', berat : 800},
    {nama: 'gamis', berat : 800},
    {nama: 'blouse', berat : 350},
    {nama: 'hoodie', berat : 600},
  ];

  constructor(
    private dataService: DataService,
  ) {}

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

  baca(teks: string) {
    teks = teks.replace(/\r?\n|\r/gi, '\n').toLowerCase();
    let result: {data?: Invoice, error?: string};
    let error = []; let ercode = null;

    const inv = {} as Invoice;
    let splitText;
    teks.split('keep').length > 1 ? splitText = teks.split('keep') : splitText = ['', ''];
    inv.id = this.getTime() + '-' + this.uid(2, {alphabetMode: true, mixResult: true});
    inv.kodeUnik = +this.uid(3);
    inv.waktuOrder = this.getTime();
    inv.status = 'keep';
    inv.active = true;
    inv.dicek = false;
    inv.diskon = 0;
    inv.deposit = 0;
    inv.subtotal = 0;
    inv.berat = 0;
  
    // getPenerima
    const penerima = {} as Penerima;
    const tex = splitText[0];
    let errorPenerima = false;
    // tslint:disable-next-line: max-line-length
    if (tex.match(/nama:/gi)) { penerima.nama = this.regexx(tex, 'nama:', '\n').replace(/[^a-z A-Z.,()t]/g, '');
    } else { ercode = '2.nama'; errorPenerima = true; }
    if (tex.match(/alamat:/gi)) { penerima.alamat = this.regexx(tex, 'alamat:', 'kec.');
    } else { ercode = '2.alamat'; errorPenerima = true; }
    if (tex.match(/kec./gi)) {
      if (tex.match(/kab/gi)) { penerima.kec = this.regexx(tex, 'kec.', 'kab.').replace(/[^A-Z a-z]/g, '');
      } else { ercode = '2.kabupaten'; errorPenerima = true; }
    } else { ercode = '2.kecamatan'; errorPenerima = true; }
    if ( tex.match(/hp:/gi) && this.formatHp(this.regexx(tex, 'hp:', '\n')) ) {
      penerima.hp = this.formatHp(this.regexx(tex, 'hp:', '\n'));
    } else { ercode = '2.hp'; errorPenerima = true; }
    // tslint:disable-next-line: max-line-length
    if (errorPenerima) { inv.penerima = {} as Penerima; } else { inv.penerima = penerima; }
    // getPenerima

    // getPengirim
    const pengirim = {} as Pengirim;
    if (tex.match(/pengirim/gi) ) {
      const sender = this.regexx(tex, 'pengirim: ', '$').split('\n');
      pengirim.nama = sender[0].trim();
      pengirim.hp = this.formatHp(sender[1]);
      // let ctr = false;
      // get hpPengirim and pengirim from split variable sender
      // for (let i = sender.length - 1; i >= 0; i--) {
      //   if ( sender[i] !== '' && !ctr ) {
      //     ctr = true;
      //     pengirim.hp = this.formatHp(sender[i]);
      //   }
      // }
    }
    inv.pengirim = pengirim;
    // getPengirim

    // getBarang
    if (splitText[1]) {
      const listAmbilan: Ambilan[] = [];
      const lis = splitText[1].replace(/[^0-9a-zA-Z ,-/\n]/g, '').trim().split('\n');
      // console.log(lis)
      lis.forEach((data, i) => {
        const datas = data.split(',');
        if (datas.length === 5) {
          // console.log(datas[4].replace(/[^0-9]/g, ''));
          const jumlah = +datas[4].replace(/[^0-9]/g, '');
          for (let x = 1; x <= jumlah; x++) {
            const ambilan: Ambilan = {
              owner_id: null,
              cs: null,
              pj: '',
              waktuScan: 0,
              tglPrint: 0,
              printed: false,
              barcode : inv.id + '-' + this.uid(2, {alphabetMode: true, mixResult: true}),
              berat: this.hitungBerat(datas[1]),
              penerima: penerima.nama,
              hargaBeli: this.hitungHargaBeli(+datas[3].replace(/[^0-9]/g, '')) * 1000,
              hargaJual: +datas[3].replace(/[^0-9]/g, '') * 1000,
              nama: datas[1].trim(),
              toko: datas[0].trim(),
              warna: datas[2].trim(),
              statusKeep: 'keep',
              waktuKeep: inv.waktuOrder
            };
            inv.subtotal += ambilan.hargaJual;
            inv.berat += ambilan.berat;
            listAmbilan.push(ambilan);
          }
        } else {
          ercode = `1.${i + 1}`;
        }
      });
      inv.subtotal += inv.kodeUnik;
      inv.pesanan = listAmbilan;
    } else {
      ercode = '0.0';
    }
    // getBarang

    if (ercode) { error = ercode.split('.'); }
    // if (inv.pemesan == null) {
    //   result = { error: 'maaf, id dropshiper tidak ditemukan'};
    // } else
    if ( error[0] === '0' ) {
      result = { error: 'Maaf, format input order salah!' }
    } else if ( error[0] === '1' ) {
      result = { error: `Maaf, format keep barang no.${error[1]} salah!`};
    } else if ( error[0] === '2' ) {
        result = { error: `Maaf, format ${error[1]} penerima salah!`};
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
  hitungBerat(barang: string) {
    let berat = 500;
    this.dataBerat.forEach((data) => {
      if ( barang.includes(data.nama) ) {
        berat = data.berat;
      }
    });
    return berat;
  }
  hitungHargaBeli(hargaJual: number) { //buat dinamis
    if ( hargaJual >= 235 ) {
      return hargaJual - 35;
    } else {
      return hargaJual - 25;
    }
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
  titleCase(str: string) {
    if (str) {
      return str.toLowerCase().split(' ').map((word) => {
        if (word[0]) {
          return word.replace(word[0], word[0].toUpperCase());
        } else { return ''; }
      }).join(' ');
    } else { return ''; }
  }

}
