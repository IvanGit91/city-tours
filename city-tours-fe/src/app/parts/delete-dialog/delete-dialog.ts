import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {News} from 'src/app/model/News';
import {NewsService} from 'src/app/shared/services/model/news.service';

@Component({
  selector: 'app-modal',
  templateUrl: './delete-dialog.html',
  styleUrls: ['./delete-dialog.css']
})
export class ModalComponent implements OnInit {

  constructor(public modalRef: MatDialogRef<ModalComponent>, private _newsService: NewsService,
              @Inject(MAT_DIALOG_DATA) public data: News) {
  }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.modalRef.close();
  }

  deleteNews(): void {
    this._newsService.deleteLogical(this.data.id).subscribe((resp) => {
      //window.console.log(resp);
    });
    this.modalRef.close();
    window.location.reload();
  }

}
