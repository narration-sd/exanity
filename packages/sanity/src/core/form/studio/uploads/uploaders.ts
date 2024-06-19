import {type SanityClient} from '@sanity/client'
import {type SchemaType} from '@sanity/types'
import {map} from 'rxjs/operators'

import {set} from '../../patch'
import {type Uploader, type UploaderDef, type UploadOptions} from './types'
import {uploadFile} from './uploadFile'
import {uploadImage} from './uploadImage'

const UPLOAD_IMAGE: UploaderDef = {
  type: 'image',
  accepts: 'image/*',
  upload: (client: SanityClient, file: File, type?: SchemaType, options?: UploadOptions) =>
    uploadImage(client, file, options),
}

const UPLOAD_FILE: UploaderDef = {
  type: 'file',
  accepts: '',
  upload: (client: SanityClient, file: File, type: SchemaType, options?: UploadOptions) =>
    uploadFile(client, file, options),
}

const UPLOAD_TEXT: UploaderDef = {
  type: 'string',
  accepts: 'text/*',
  upload: (client: SanityClient, file: File, type: SchemaType, options?: UploadOptions) =>
    uploadFile(client, file, options).pipe(
      map((content) => ({
        type: 'uploadProgress',
        patches: [set(content)],
      })),
    ),

  // Todo: promote this to a "first-class" form-builder abstraction
  // and make it possible to register custom uploaders
}

export const uploaders: Array<Uploader> = [UPLOAD_IMAGE, UPLOAD_TEXT, UPLOAD_FILE].map(
  (uploader, i) => ({
    ...uploader,
    priority: i,
  }),
)
