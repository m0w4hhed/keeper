import { Component, OnInit, Input } from '@angular/core';
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
  functions;

  constructor(
    private modalCtrl: ModalController,
    public tool: ToolService,
  ) {
  }
  ngOnInit() {}

  ok() {
    const data = Object.assign({}, ...this.data.map(d => ({ [d.key]: d.value })));
    this.functions.onSubmitFunction(data);
    this.modalCtrl.dismiss();
  }

}
