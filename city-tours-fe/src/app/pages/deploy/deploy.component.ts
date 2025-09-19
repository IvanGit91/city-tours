import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {UtilityService} from "../../shared/services/model/utility.service";
import {DistUtils} from "../../shared/util/DistUtils";

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.css']
})
export class DeployComponent implements OnInit {
  @ViewChild('backendInput') backendInput: ElementRef;
  backendFileName = null;
  @ViewChild('frontendInput') frontendInput: ElementRef;
  frontendFileName = null;
  countLoading: number = 0;
  showLoading: boolean = false;
  deploy = this.fb.group({
    backend: ([null,]),
    frontend: ([null,])
  });

  constructor(public fb: FormBuilder,
              private _service: UtilityService) {
  }

  ngOnInit(): void {
  }

  uploadFileEvt(imgFile: any, backend: boolean) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      const file = imgFile.target.files[0];

      if (backend) {
        this.backendFileName = file.name;
        this.deploy.patchValue({
          backend: file
        });
      } else {
        this.frontendFileName = file.name;
        this.deploy.patchValue({
          frontend: file
        });
      }

      // Reset if duplicate image uploaded again
      this.backendInput.nativeElement.value = "";
      this.frontendInput.nativeElement.value = "";

      // HTML5 FileReader API
      let reader = new FileReader();
      let image = new Image();
      reader.onload = (e: any) => {
        image.src = e.target.result;
        image.onload = rs => {

        };
      };
      reader.readAsDataURL(file);
    } else {
      this.backendFileName = null;
      this.frontendFileName = null;
    }
  }

  removeUploadedFile(backend: boolean) {
    if (backend) {
      this.backendInput.nativeElement.value = "";
      this.backendFileName = null;
      this.deploy.patchValue({
        backend: null
      });
    } else {
      this.frontendInput.nativeElement.value = "";
      this.frontendFileName = null;
      this.deploy.patchValue({
        frontend: null
      });
    }
  }

  onSubmit() {
    if (this.deploy.value.backend !== null) {
      this.showLoading = true;
      this.countLoading++;
      this._service.upload(this.deploy.value.backend, true).subscribe(d => {
        DistUtils.snackMessage("Backend uploaded successfully");
        this.removeUploadedFile(true);
        this.countLoading--;
        if (this.countLoading == 0) {
          this.showLoading = false;
        }
      }, e => console.log(e));
    }

    if (this.deploy.value.frontend !== null) {
      this.showLoading = true;
      this.countLoading++;
      this._service.upload(this.deploy.value.frontend, false).subscribe(d => {
        DistUtils.snackMessage("Frontend uploaded successfully");
        this.removeUploadedFile(false);
        this.countLoading--;
        if (this.countLoading == 0) {
          this.showLoading = false;
        }
      }, e => console.log(e));
    }

  }
}
