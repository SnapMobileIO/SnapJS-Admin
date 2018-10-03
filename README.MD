# snapjs-admin

# WARNING updating this module to 0.3.12+ is dependant on updating your snapjs-aws to 1.1.0+

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
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ConstantsService } from "./providers/constants.service";

import { AppComponent } from "./app.component";

// Import your library
import { SampleModule } from "@snapmobile/snapjs-admin";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,

    // Specify your library as an import
    SnapJSAdminModule.forRoot(ConstantsService)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Config Service

You need to add the admin constants to your `ConstantsService`. Technically this is optional, but it won't get you far. Reference the required properties in the [`ConstantsService` included in the module](https://github.com/SnapMobileIO/SnapJS-Admin/blob/master/src/admin/constants.service.ts).

If you don't already have a ConstantsService in your app, you can copy the one from the admin module.

### WYSIWYG Editor Configuration

To enable portal users to edit string-type fields with a what-you-see-is-what-you-get text editor, you can add an override to your project's `DEFAULT_SCHEMA_OVERWRITES` as follows:

```
  DEFAULT_SCHEMA_OVERWRITES: object = {
    yourModelName: {
      yourFieldName: {
        instanceOverride: 'Wysiwyg',
      },
    },
```

This WYSIWYG editor, powered by [tinymce](https://github.com/tinymce/tinymce), replaces the single-line field for text entry in the admin portal's Create/Edit views with a robust in-browser interface akin to that of typical word processor software. The editor outputs validly-tagged HTML that appears in a view the same way it did when it was edited.

The editor has been configured to work "out of the box", with dropdowns to select named format types (e.g. "Header 1") and buttons to style highlighted text in a variety of ways (e.g. bold, italicized, numbered bullets, center-justified text). The default configuration may enable modifications to styling that venture outside your client's needs, or leave out options that the client has requested.

With that in mind, SnapJS-Admin enables configuration of the WYSIWYG editor from the `constants.service` file in your project's (web) source code. Use `ADMIN_WYSIWYG_OPTIONS` to set a config object, which will be called on when SnapJS-Admin initializes the tinymce editor.

Here is a sample config setup that restricts the toolbar to a style select dropdown (with selectable formats that appear as "Page Header" and "Section Header"), and buttons to make text bold, italic, bulleted, numbered, and/or linked:

```
  ADMIN_WYSIWYG_OPTIONS: object = {
      toolbar: 'styleselect | bold italic | bullist numlist | link',
      style_formats: [
        { title: 'Page Header', format: 'h1' },
        { title: 'Section Header', format: 'h3' },
      ],
    };
```

The `ADMIN_WYSIWYG_OPTIONS` object is merged with the object passed into `tinymce.init()`, overwriting any shared keys with the custom config values.

Tinymce has extensive documentation on properties that can be passed into their `init()` function. [The editor appearance docs](https://www.tiny.cloud/docs/configure/editor-appearance/) are a great place to start looking if you want to figure out how to make a specific change not outlined here.

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
