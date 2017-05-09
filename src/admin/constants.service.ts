import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {
  ROOT_URL: string = '';
  API_BASE_URL: string = 'http://localhost:3000/api';
  AWS_S3_BASE_URL: string = 'https://test-aws-lamda-bucket.s3.amazonaws.com';
  ONESIGNAL_APP_ID: string  = '';
  GOOGLE_PROJECT_NUMBER: string = '';
  GOOGLE_ANALYTICS_TRACKING_ID: string = '';
  FILE_UPLOAD_DEFAULT_ALLOWED_MIME_TYPES: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'text/plain', 'text/csv',
                                                      'audio/mpeg', 'video/mp4'];
  FILE_UPLOAD_DEFAULT_MAX_FILE_SIZE: number = 10000000;
  IMAGE_MIME_TYPES: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  SIDEBAR_ITEMS: object[] = [
    {
      title: 'Users',
      icon: 'users',
      class: 'User',
    },
    {
      title: 'Companies',
      icon: 'mobile',
      class: 'Company',
    },
  ];
  DEFAULT_SCHEMA_OVERWRITES: object = {
    Company: {
      roles: {
        instance: 'MultiSelect',
        options: ['admin', 'manager', 'user', 'employee'],
      },
      singleRole: {
        instance: 'SingleSelect',
        options: ['admin', 'manager', 'user', 'super admin', 'intern'],
      },
      overview: {
        instance: 'Wysiwyg',
      },
      __v: {
        instance: 'Remove',
      },
      _id: {
        instance: 'Hidden',
      },
      createdAt: {
        instance: 'Disabled',
      },
      updatedAt: {
        instance: 'Disabled',
      },
      avatar: {
        instance: 'Image',
        // allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png'],
      },
      images: {
        instance: 'ImageArray',
        allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png'],
      },
      _createdBy: {
        searchField: 'firstName',
      },
      _locations: {
        searchField: 'name',
      },
      _relationship: {
        searchField: 'name',
      },
    },
    User: {
      avatar: {
        instance: 'Image',
        allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png'],
      },
      password: {
        instance: 'Remove',
      },
    },
  };

  constructor() {
    /**
     * Only overwrite dynamic constants here
     * All other constants should use default values above
     */
    this.ROOT_URL = window.location.origin;
  }
}
