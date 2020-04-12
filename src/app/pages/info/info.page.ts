import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
  	private modalCtrl: ModalController,
  	private tool: ToolService,
  ) { }
  ngOnInit() {
  }

  kontak(type: string) {
  	this.tool.kontak(type);
  }

  dismiss() {
  	this.modalCtrl.dismiss();
  }

}
