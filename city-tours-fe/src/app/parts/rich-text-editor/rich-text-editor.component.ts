import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Editor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor5} from '@ckeditor/ckeditor5-angular/ckeditor';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit {
  static readonly configuration: CKEditor5.Config = {
    removePlugins: ['Heading'],
    language: 'it',
    toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote',
      'mediaEmbed', 'undo', 'redo'],
    mediaEmbed: {
      previewsInData: true
    }
  };
  public editor: Editor;
  @Output() dataChange = new EventEmitter<string>();

  constructor() {
    this.editor = Editor;
    this._config = RichTextEditorComponent.configuration;
  }

  private _config: CKEditor5.Config;

  get config(): CKEditor5.Config {
    return this._config;
  }

  @Input()
  set config(conf: CKEditor5.Config) {
    this._config = {...RichTextEditorComponent.configuration, ...conf};
  }

  private _data = '';

  get data(): string {
    return this._data;
  }

  @Input()
  set data(data: string) {
    this._data = data;
    this.dataChange.emit(this._data);
  }

  ngOnInit(): void {
  }

}
