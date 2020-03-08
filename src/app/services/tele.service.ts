import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  // Bot Account Config
  token = '1142173253:AAGnmx7q6zeswQJ2kySARIFpBxqKJN71QvQ'; // KeeperPendaftaran
  channelId = '499631901'; // '@NabiilahGudang';
  SERVER_URL = 'https://api.telegram.org/bot' + this.token;
  uploadForm: FormGroup;

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * @param photoFile is URL or Blob File
   * @param toChatID is chat_id user or channel ex. `499631901` (user) `@Pendaftaran` (channel)
   */
  sendPhoto(photoFile, toChatID: string, caption?: string) {
    const formData = new FormData();
    formData.append('chat_id', toChatID);
    formData.append('photo', photoFile);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    return this.httpClient.post<any>(this.SERVER_URL + '/sendPhoto', formData, {reportProgress: true, observe: 'events'})
      .pipe(first()).subscribe();
  }
  sendMultiple(photoFileArray: any[]) {
    photoFileArray.forEach(photoFile => {
      const formData = new FormData();
      formData.append('chat_id', this.channelId);
      formData.append('photo', photoFile);
      formData.append('parse_mode', 'Markdown');
      return this.httpClient.post<any>(this.SERVER_URL + '/sendPhoto', formData, {reportProgress: true, observe: 'events'})
        .pipe(first()).subscribe();
    });
  }
  /**
   * @param text is text to send
   * @param toChatID is chat_id user or channel ex. `499631901` (user) `@Pendaftaran` (channel)
   */
  sendText(text: string, toChatID: string) {
    // console.log(text);
    return this.httpClient.get(this.SERVER_URL + '/sendMessage?chat_id=' + toChatID + '&text=' + encodeURIComponent(text))
      .pipe(first()).subscribe();
  }

}
