import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  
  private cekOngkirMutation = gql`
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
  private cekWAMutation = gql`
    mutation cekWA(
      $numbs: [String]
      ) {
        cekWA(numbs: $numbs)
      }
  `;
  private sendFcmMutation = gql`
    mutation sendFCM(
      $title: String!,
      $body: String!,
      $topic: String!,
      $image: String,
      $landing_page: String,
      $args: String
    ) {
      sendFCM(data: {
        title: $title,
        body: $body,
        topic: $topic,
        image: $image,
        landing_page: $landing_page,
        args: $args
      })
    }
  `;

  constructor(
    private apollo: Apollo,
  ) { }

  cekOngkir(asalID: string, tujuanID: string, beratPaket: string) {
    // console.log('cek: ', asalID, tujuanID);
    return this.apollo.mutate({
      mutation: this.cekOngkirMutation,
      variables: {
        origin: asalID,
        originType: 'subdistrict',
        destination: tujuanID,
        destinationType: 'subdistrict',
        weight: beratPaket,
        courier: 'jne:pos:tiki:wahana:jnt:lion'
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
  
  sendNotification(title: string, body: string, topic: string, options?: {landingPage?: string, image?: string, args?: string}|null) {
    return this.apollo.mutate({
      mutation: this.sendFcmMutation,
      variables: {
        title, body, topic,
        image: options ? options.image : '',
        landing_page: options ? options.landingPage : '',
        args: options ? options.args : ''
      }
    }).pipe(
      map(data => console.log(data))
    ).toPromise();
  }

}
