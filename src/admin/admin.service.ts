import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';
import { ConstantsService } from './constants.service';

@Injectable()
export class AdminService {
  className: string;
  schema: any;
  schemaKeys: string[];

  constructor(
    private http: Http,
    private constants: ConstantsService,
  ) { }

  loadSchema(): Promise<{}> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/schema`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => {
        // Set schema and merge any overwrites
        this.schema = response.json();
        this.schemaKeys = Object.keys(this.schema);
        this.schema = _.merge(this.schema, this.constants.DEFAULT_SCHEMA_OVERWRITES[this.className]);

        return this.schema;
      });
  }

  query(params: {} = {}): Promise<any> {
    let queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}?`;

    const serializedParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        serializedParams.set(key, params[key]);
      }
    }

    queryUrl += serializedParams.toString();

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => response.json());
  }

  getById(id: string): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${id}`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  update(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${object._id}`;

    return this.http.put(queryUrl, object)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  create(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}`;

    return this.http.post(queryUrl, object)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  delete(object: any): Promise<any> {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/${object._id}`;

    return this.http.delete(queryUrl)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  deleteMultiple(objectIds: string[]) {
    const queryUrl = `${this.constants.API_BASE_URL}/admin/${this.className}/deleteMultiple`;

    return this.http.post(queryUrl, { ids: objectIds })
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }

  search(className: string, search: string, field: string = 'name', params: any = { limit: 10 }): Promise<any> {
    let queryUrl = `${this.constants.API_BASE_URL}/admin/${className}`;

    const serializedParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        serializedParams.set(key, params[key]);
      }
    }

    queryUrl += `?${serializedParams.toString()}`;

    queryUrl += `&filters[0][field]=${field}&filters[0][operator]=like&filters[0][value]=${search}`;

    return this.http.get(queryUrl)
      .toPromise()
      .then((response) => response.json());
  }

  /**
   * Check if an object is an array of file objects
   * @param {any}    object The object being displayed in detail/list view
   * @param {string} key    The field on the document
   */
  isFileType(object: any, key: string) {
    if (object[key] && object[key].length && object[key][0].url) {
      return true;
    } else {
      return false;
    }
  }

}
