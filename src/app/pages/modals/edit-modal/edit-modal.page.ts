import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.page.html',
  styleUrls: ['./edit-modal.page.scss'],
})
export class EditModalPage implements OnInit {

  title: string;
  data: any[];

  constructor(
    private modalCtrl: ModalController,
    public tool: ToolService,
  ) { }

  ngOnInit() {
  }

  dismiss(rawData?) {
    if (rawData) {
      const data = Object.assign({}, ...rawData.map(d => ({ [d.key]: d.value })));
      this.modalCtrl.dismiss(data);
    } else { this.modalCtrl.dismiss(); }
  }

}
