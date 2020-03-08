import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SwitcherService } from 'src/app/services/switcher.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-ambilan',
  templateUrl: 'ambilan.page.html',
  styleUrls: ['ambilan.page.scss']
})
export class AmbilanPage {

  constructor(
    public userService: UserService,
    public switcher: SwitcherService,
    public tool: ToolService,
  ) {}

}
