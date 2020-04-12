import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SwitcherService } from 'src/app/services/switcher.service';
import { ToolService } from 'src/app/services/tool.service';
import { Ambilan } from 'src/app/services/interfaces/invoice';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ambilan',
  templateUrl: 'ambilan.page.html',
  styleUrls: ['ambilan.page.scss']
})
export class AmbilanPage {

  onload = true;
  ambilan: Ambilan[]; task;
  groupBy = 'penerima';

  constructor(
    public userService: UserService,
    public switcher: SwitcherService,
    public tool: ToolService,
  ) {
    this.task = this.userService.user$.pipe(
      switchMap(user => {
        return this.switcher.getAmbilan(user) as Observable<Ambilan[]>
      })
    ).subscribe(res => {
      this.onload = false;
      this.ambilan = res;
    });
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
