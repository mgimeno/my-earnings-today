import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  readonly profileLink = environment.profileLink;
}
