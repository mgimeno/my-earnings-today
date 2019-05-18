import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent{

  creatorProfileLink: string = null;

  constructor() {
    this.creatorProfileLink = environment.creatorProfileLink;
  }

}
