import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { finalize, share, map } from 'rxjs/operators';
// import { HTTP } from '@ionic-native/http/ngx';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { DataService } from './data.service';
import { UserConfig } from './interfaces/user.config';
import { Kecamatan } from './interfaces/ongkir';

@Injectable({
  providedIn: 'root'
})
export class EkspedisiService {

  USER_CONFIG: UserConfig; task
  dataKecamatan: Kecamatan[]; task2;
  ekspedisi = 'jne%3Apos%3Atiki%3Awahana%3Ajnt%3Aindah%3Alion';
  headers: HttpHeaders;

  cekOngkirMutation = gql`
  mutation cekOngkir(
    $origin: String!,
    $originType: String!,
    $destination: String!,
    $destinationType: String!,
    $weight: String!,
    $courier: String!
    ) {
    cekOngkir(data: {
      origin: $origin,
      originType: $originType,
      destination: $destination,
      destinationType: $destinationType,
      weight: $weight,
      courier: $courier }
      ) {
        code
        name
        service
        description
        cost
        etd
      }
    }
  `;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private apollo: Apollo,
    // private httpNative: HTTP
  ) {
    this.task = this.dataService.userConfig.subscribe(res => {
      this.USER_CONFIG = res;
    })
    this.task2 = this.http.get('assets/rajaongkir.kec.json').subscribe(res => {
      this.dataKecamatan = res as Kecamatan[];
    });
  }

  cekOngkir(asalID: number, tujuanID: number, berat: number) {
    if (asalID && tujuanID && berat) {
      const headers = new HttpHeaders()
      .append('key', this.USER_CONFIG.key)
      .append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line: max-line-length
      const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
      return this.http.post(this.USER_CONFIG.cors_proxy + this.USER_CONFIG.graphqlAPI + '/cost', data, {headers}).pipe(share());
    }
  }

  cekOngkirNative(asalID: number, tujuanID: number, berat: number) {
    if (asalID && tujuanID && berat) {
      const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line: max-line-length
      const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
      const dataO = {
        origin: asalID.toString(),
        originType: 'subdistrict',
        destination: tujuanID.toString(),
        destinationType: 'subdistrict',
        weight: berat,
        courier: this.ekspedisi
      };
      const dataOparse = JSON.stringify(dataO);
      // this.httpNative.setDataSerializer('urlencoded');
      // this.httpNative.setHeader('*', 'key', '987286a844f6ef239329061fa837f43e');
      // return this.httpNative.sendRequest(this.api + '/cost', {
      //  method: 'post',
      //  data: {data},
      //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //  timeout: 5000
      // });
      // return this.httpNative.post(this.api + '/cost', dataO, {});
    }
  }
  cekOngkirQL(asalID: string, tujuanID: string, beratPaket: string) {
    return this.apollo.mutate({
      mutation: this.cekOngkirMutation,
      variables: {
        origin: asalID,
        originType: 'subdistrict',
        destination: tujuanID,
        destinationType: 'subdistrict',
        weight: beratPaket,
        courier: 'jne:wahana:pos:tiki:jnt:indah:lion'
      }
    });
  }

  cariKecamatan(searchTerm: string, maxResult: number) {
    if (!this.dataKecamatan) {return []; }
    return this.dataKecamatan.filter(item => {
      return item.subdistrict_name.toLowerCase().includes(searchTerm.toLowerCase());
    }).splice(0, maxResult);
  }
}
