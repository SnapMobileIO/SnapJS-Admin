# snapjs-admin

## Installation

To install this library, make sure you have access, then run:

```bash
$ npm install @snapmobile/snapjs-admin --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install @snapmobile/snapjs-admin
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ConstantsService } from './providers/constants.service';

import { AppComponent } from './app.component';

// Import your library
import { SampleModule } from '@snapmobile/snapjs-admin';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    SnapJSAdminModule.forRoot(ConstantsService),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Config Service

You need to add the admin constants to your `ConstantsService`. Technically this is optional, but it won't get you far. Reference the required properties in the [`ConstantsService` included in the module](https://github.com/SnapMobileIO/SnapJS-Admin/blob/master/src/admin/constants.service.ts).

If you don't already have a ConstantsService in your app, you can copy the one from the admin module. 

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To push to NPM as a private repo (you'll need to get access to publish)
update the package.json version number in both the root and dist folder. Then run:

```bash
$ npm publish dist
```


Built using [generator-angular2-library](https://github.com/jvandemo/generator-angular2-library) Yeoman generator.

## License

MIT © [Brandon Passley](mailto:brandon@snapmobile.io)
