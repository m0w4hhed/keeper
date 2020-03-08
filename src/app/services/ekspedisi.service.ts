import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { share } from 'rxjs/operators';

import { DataService } from './data.service';
import { UserConfig } from './interfaces/user.config';
import { Kecamatan } from './interfaces/ongkir';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EkspedisiService {

  dataKecamatan: Kecamatan[]; task2;
  ekspedisi = 'jne%3Apos%3Atiki%3Awahana%3Ajnt%3Aindah%3Alion';

  constructor(
    private userService: UserService,
    private http: HttpClient,
    // private httpNative: HTTP
  ) {
    this.task2 = this.http.get('assets/rajaongkir.kec.json').subscribe(res => {
      this.dataKecamatan = res as Kecamatan[];
    });
  }

  async cekOngkir(asalID: number, tujuanID: number, berat: number) {
    const USER_CONFIG = await this.userService.getConfigs();
    if (asalID && tujuanID && berat) {
      const headers = new HttpHeaders()
      .append('key', USER_CONFIG.key)
      .append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line: max-line-length
      const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
      return await this.http.post(USER_CONFIG.cors_proxy + USER_CONFIG.graphqlAPI + '/cost', data, {headers}).pipe(share()).toPromise();
    }
  }

  cariKecamatan(searchTerm: string, maxResult: number) {
    if (!this.dataKecamatan) {return []; }
    return this.dataKecamatan.filter(item => {
      return item.subdistrict_name.toLowerCase().includes(searchTerm.toLowerCase());
    }).splice(0, maxResult);
  }
  
  // cekOngkirNative(asalID: number, tujuanID: number, berat: number) {
  //   if (asalID && tujuanID && berat) {
  //     const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
  //     // tslint:disable-next-line: max-line-length
  //     const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
  //     const dataO = {
  //       origin: asalID.toString(),
  //       originType: 'subdistrict',
  //       destination: tujuanID.toString(),
  //       destinationType: 'subdistrict',
  //       weight: berat,
  //       courier: this.ekspedisi
  //     };
  //     const dataOparse = JSON.stringify(dataO);
  //     // this.httpNative.setDataSerializer('urlencoded');
  //     // this.httpNative.setHeader('*', 'key', '987286a844f6ef239329061fa837f43e');
  //     // return this.httpNative.sendRequest(this.api + '/cost', {
  //     //  method: 'post',
  //     //  data: {data},
  //     //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     //  timeout: 5000
  //     // });
  //     // return this.httpNative.post(this.api + '/cost', dataO, {});
  //   }
  // }
}
