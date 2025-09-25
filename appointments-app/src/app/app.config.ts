import { ApplicationConfig } from '@angular/core';
import { provideNgIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { tablerClock } from '@ng-icons/tabler-icons';

export const appConfig: ApplicationConfig = {
  providers: [provideNgIcons({ heroUsers, tablerClock })]
};
