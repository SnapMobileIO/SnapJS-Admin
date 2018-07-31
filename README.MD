# snapjs-admin

## Installation

To install this library, make sure you have access, then run:

```bash
$ npm install @snapmobile/snapjs-admin --save
```

## Publish library to NPM
To push to NPM as a private repo (you'll need to get access to publish). Build the dist folder by running:

```bash
$ npm run build
```

Update the package.json version number in the root of the project.

Then we have to manually add a package.json file to the dist/ folder with the updated version number. Here is an example:

```
{
  "name": "@snapmobile/snapjs-admin",
  "version": "0.2.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/SnapMobileIO/SnapJS-Admin"
  },
  "author": {
    "name": "Brandon Passley",
    "email": "brandon@snapmobile.io"
  },
  "keywords": [
    "angular"
  ],
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/SnapMobileIO/SnapJS-Admin/issues"
  },
  "module": "snapjs-admin.js",
  "typings": "snapjs-admin.d.ts",
  "peerDependencies": {
    "@angular/core": "^4.0.0",
    "rxjs": "^5.3.1",
    "zone.js": "^0.8.10"
  }
}
```

Then you can run:

```bash
$ npm publish dist
```

`prepublishOnly` script in this case will automatically run project testing and linting prior to checking that the library is ready for publishing.

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install @snapmobile/snapjs-admin
```

If you get a 404 error, double check that the auth token your .npmrc matches the auth token in the Web seed project.

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


## File Structure

```
angular-library-seed
  ├─ demo                         * Folder for demo applications (MAY BE DELETED if not required) 
  |  ├─ esm                       * AOT/JIT demo project
  |  ├─ umd                       * UMD demo project
  |  └─ ...                       * More details about this folder may be found in demo folder README file.
  |
  ├─ src                          * Library sources home folder (THE PLACE FOR YOUR LIBRARY SOURCES)
  |  ├─ components                * Example of library components with tests
  |  ├─ services                  * Example of library services with tests
  |  ├─ index.ts                  * Library entry point that is used by builders
  |  └─ tick-tock.module.ts       * Example of library module
  |
  ├─ .editorconfig                * Common IDE configuration
  ├─ .gitignore                   * List of files that are ignored while publishing to git repo
  ├─ .npmignore                   * List of files that are ignored while publishing to npm
  ├─ .travis.yml                  * Travic CI configuration
  ├─ LICENSE                      * License details
  ├─ README.md                    * README for you library
  ├─ gulpfile.js                  * Gulp helper scripts
  ├─ karma-test-entry.ts          * Entry script for Karma tests
  ├─ karma.conf.ts                * Karma configuration for our unit tests
  ├─ package.json                 * NPM dependencies, scripts and package configuration
  ├─ tsconfig-aot.json            * TypeScript configuration for AOT build
  ├─ tsconfig.json                * TypeScript configuration for UMD and Test builds
  ├─ tslint.json                  * TypeScript linting configuration
  ├─ webpack-test.config.ts       * Webpack configuration for building test version of the library
  └─  webpack-umd.config.ts        * Webpack configuration for building UMD bundle
```

## Build the library
- `npm build` for building the library once (both ESM and AOT versions).
- `npm build:watch` for building the library (both ESM and AOT versions) and watch for file changes.

You may also build UMD bundle and ESM files separately:
- `npm build:esm` - for building AOT/JIT compatible versions of files.
- `npm build:esm:watch` - the same as previous command but in watch-mode.
- `npm build:umd` - for building UMD bundle only.
- `npm build:umd:watch` - the same as previous command but in watch-mode.

## Other commands

#### Lint the code
- `npm lint` for performing static code analysis.

#### Test the library
- `npm test` for running all your `*.spec.ts` tests once. Generated code coverage report may be found in `coverage` folder.
- `npm test:watch` for running all you `*.spec.ts` and watch for file changes.

#### Generate documentation
- `npm docs` for generating documentation locally.
- `npm gh-pages` for generating documentation and uploading it to GitHub Pages. [Documentation example](https://trekhleb.github.io/angular-library-seed/).

#### Explore the bundle
- `npm explorer` to find out where all your code in bundle is coming from.

#### Bump library version
- `npm version patch` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

`preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing.

#### Cleaning
- `npm clean:tmp` command will clean up all temporary files like `docs`, `dist`, `coverage` etc.
- `npm clean:all` command will clean up all temporary files along with `node_modules` folder. 

Built using [https://github.com/trekhleb/angular-library-seed.git](angular-library-seed).
