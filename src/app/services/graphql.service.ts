import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  
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
    cekWAMutation = gql`
    mutation cekWA(
      $numbs: [String]
      ) {
        cekWA(numbs: $numbs)
      }
    `;

  constructor(
    private apollo: Apollo,
  ) { }

  cekOngkir(asalID: string, tujuanID: string, beratPaket: string) {
    return this.apollo.mutate({
      mutation: this.cekOngkirMutation,
      variables: {
        origin: asalID,
        originType: 'subdistrict',
        destination: tujuanID,
        destinationType: 'subdistrict',
        weight: beratPaket,
        courier: 'jne:wahana:pos:tiki:jnt:lion'
      }
    }).pipe(
      map(d => d.data["cekOngkir"])
    );
  }
  /**
   * 
   * @param nomor prefix nomor hp adalah 62 (kode negara tanpa tanda +)
   */
  cekWA(nomor: string): Promise<boolean> {
    return this.apollo.mutate({
      mutation: this.cekWAMutation,
      variables: { numbs: [nomor] }
    }).pipe(
      map(d => d.data["cekWA"][0])
    ).toPromise();
  }

}
