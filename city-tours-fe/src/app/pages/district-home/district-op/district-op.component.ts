import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AppErrorStateMatcher} from "../../../shared/util/ErrorMatcher";
import {DistrictService} from "../../../shared/services/model/district.service";
import * as Constant from '../../../shared/util/constant';
import {IMAGE_MAX_HEIGHT, IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, WEB_SITE_REGEX} from '../../../shared/util/constant';
import * as L from 'leaflet';
import 'src/assets/libs/Leaflet.Editable';
import {animate, style, transition, trigger} from "@angular/animations";
import {Geo} from "../../../model/geo/Geo";
import {UtilityService} from "../../../shared/services/model/utility.service";
import {City} from "../../../model/City";
import {Subject} from 'rxjs'
import {DistTel} from "../../../model/common/DistTel";
import {DistFile} from "../../../model/common/DistFile";
import {District} from "../../../model/District";
import {DistUtils} from "../../../shared/util/DistUtils";
import {ImageCheck} from "../../../dto/ImageCheck";
import {ThemePalette} from "@angular/material/core";
import {Color} from "@angular-material-components/color-picker";

declare const window: any;

@Component({
  selector: 'app-district-op',
  templateUrl: './district-op.component.html',
  styleUrls: ['./district-op.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class DistrictOpComponent extends L.Control implements OnInit, OnDestroy, AfterViewInit {
  matcher = new AppErrorStateMatcher();
  elemId: number;
  isEdit = false;
  geoError: boolean = false;
  cities = new Subject<City[]>();
  originalFillColor = null;
  originalColor = "#3388ff";
  selectedFillColor = 'red';
  selectedColor = 'green';
  minLengthQuery: number = 2;
  // IMAGES
  imageSize: number;
  // IMAGE
  @ViewChild('imageInput') imageInput: ElementRef;
  imageName = null;
  imageBase64: any = null;
  imageError: boolean = false;
  imageCheck: ImageCheck = new ImageCheck(IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
  // LOGO
  @ViewChild('logoInput') logoInput: ElementRef;
  logoName = null;
  logoBase64: any = null;
  logoError: boolean = false;
  logoCheck: ImageCheck = new ImageCheck(IMAGE_MAX_SIZE_KB, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  district = this.fb.group({
    id: [null],
    denomination: ['', [Validators.required]],
    description: ['',],
    descriptionEng: ['',],
    phone: [new DistTel('', '', ''),],
    address: ['',],
    webSite: (['', Validators.pattern(WEB_SITE_REGEX)]),
    email: ['', Validators.email],
    geos: ['',],
    imagePath: [null,],
    logoPath: [null,],
    logo: [null,],
    image: [null,],
    color: [null,]
  });
  private map;
  private geos: Geo[] = [];
  private center: any = null;
  private fadeTimeout: number = 5000;

  constructor(private _service: DistrictService,
              private _u_service: UtilityService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
    super();
  }

  get utils() {
    return DistUtils;
  }

  get districtForm() {
    return this.district.controls as any;
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.map.off();
    this.map.remove();
  }

  ngOnInit(): void {
    this.elemId = Number.parseInt(this.route.snapshot.paramMap.get(Constant.ID_NAME), 10);
    if (this.elemId === Constant.OP_ADD) {
      this.initMap();
    } else {
      this.isEdit = true;
      this._service.getById(this.elemId).subscribe(p => {
        if (p.imagePath !== null) {
          this.imageName = DistUtils.nameFromPath(p.imagePath);
          this.imageBase64 = DistUtils.file.toBase64Image(p.image);
        }
        if (p.logoPath !== null) {
          this.logoName = DistUtils.nameFromPath(p.logoPath);
          this.logoBase64 = DistUtils.file.toBase64Image(p.logo);
        }
        p.image = p.logo = null;

        p.geos.forEach(g => {
          this.center = g.geometry.coordinates[0][0][0];
          g.geometry.coordinates = JSON.stringify(g.geometry.coordinates);
        });

        this.geos = p.geos;

        if (p.color !== null) {
          let rgb = this.hexToRgb(p.color);
          p.color = new Color(rgb.r, rgb.g, rgb.b, 1);
        }
        this.district.patchValue(p);
        this.initMap();
      });
    }
  }

  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  checkPolygon() {
    let polygons = [];
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polygon && !(layer instanceof L.Rectangle)) {
        //console.log("LAYER: ", layer.getLatLngs());
      }
    });
  }

  onCityKey(target) {
    const value = (target as HTMLTextAreaElement).value;
    const filter = value.toLowerCase();
    if (filter.length > this.minLengthQuery) {
      this._u_service.citiesFilter(filter).subscribe(v => this.cities.next(v));
    }
  }

  cityOnMap(c: City, event: any) {
    if (event.isUserInput) {
      this.map.flyTo(new L.LatLng(c.lat, c.lng), 10);
    }
  }

  uploadFileEvt(imgFile: any, logo: boolean) {
    if (imgFile.target.files && imgFile.target.files[0]) {

      const file = imgFile.target.files[0];
      this.imageSize = file.size / 1024; // In KB
      if (logo) {
        this.logoName = file.name;
        this.district.patchValue({
          logo: file
        });
        this.logoInput.nativeElement.value = "";
      } else {
        this.imageName = file.name;
        this.district.patchValue({
          image: file
        });
        this.imageInput.nativeElement.value = "";
      }

      // HTML5 FileReader API
      let reader = new FileReader();
      let image = new Image();
      reader.onload = (e: any) => {

        image.src = e.target.result;
        image.onload = rs => {

          if (logo) {
            if (this.imageSize > this.logoCheck.maxSize || image.width > this.logoCheck.maxWidth || image.height > this.logoCheck.maxHeight) {
              if (this.imageSize > this.logoCheck.maxSize) {
                this.logoCheck.message = 'VALIDATION_MSG.MAX_FILE_SIZE';
                this.logoCheck.messageMax = this.logoCheck.maxSize;
              } else if (image.width > this.logoCheck.maxWidth) {
                this.logoCheck.message = 'VALIDATION_MSG.MAX_FILE_WIDTH';
                this.logoCheck.messageMax = this.logoCheck.maxWidth;
              } else {
                this.logoCheck.message = 'VALIDATION_MSG.MAX_FILE_HEIGHT';
                this.logoCheck.messageMax = this.logoCheck.maxHeight;
              }
              this.removeUploadedFile(true);
              this.logoError = true;
              setTimeout(() => {
                this.logoError = false;
              }, this.fadeTimeout);
            } else {
              this.logoBase64 = e.target.result;
            }
          } else {
            if (this.imageSize > this.imageCheck.maxSize || image.width > this.imageCheck.maxWidth || image.height > this.imageCheck.maxHeight) {
              if (this.imageSize > this.imageCheck.maxSize) {
                this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_SIZE';
                this.imageCheck.messageMax = this.imageCheck.maxSize;
              } else if (image.width > this.imageCheck.maxWidth) {
                this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_WIDTH';
                this.imageCheck.messageMax = this.imageCheck.maxWidth;
              } else {
                this.imageCheck.message = 'VALIDATION_MSG.MAX_FILE_HEIGHT';
                this.imageCheck.messageMax = this.imageCheck.maxHeight;
              }
              this.removeUploadedFile(false);
              this.imageError = true;
              setTimeout(() => {
                this.imageError = false;
              }, this.fadeTimeout);
            } else {
              this.imageBase64 = e.target.result;
            }
          }

        };
      };
      reader.readAsDataURL(file);
    } else {
      this.imageName = this.logoName = null;
    }
  }

  removeUploadedFile(logo: boolean) {
    if (logo) {
      this.logoInput.nativeElement.value = "";
      this.logoBase64 = null;
      this.logoName = null;
      this.district.patchValue({
        logoPath: null,
        logo: null
      });
    } else {
      this.imageInput.nativeElement.value = "";
      this.imageBase64 = null;
      this.imageName = null;
      this.district.patchValue({
        imagePath: null,
        image: null
      });
    }
  }

  onSubmit() {
    if (this.geos.length > 0) {
      this.district.patchValue({
        geos: this.geos
      });
      const images: DistFile[] = [new DistFile(this.district.value.image, false),
        new DistFile(this.district.value.logo, true)];

      this.district.value.image = null;
      this.district.value.logo = null;

      if (this.district.value.color != null) {
        this.district.value.color = this.district.value.color.hex;
      }

      if (!this.isEdit) {
        this._service.save(this.district.value).subscribe(d => {
            this.imagesPromise(d, images);
          },
          (e) => console.log('Error adding:', e));
      } else {
        this._service.update(this.district.value).subscribe(d => {
            this.imagesPromise(d, images);
          },
          (e) => console.log('Error updating: ', e));
      }
    } else {
      this.geoError = true;
      setTimeout(() => {
        this.geoError = false;
      }, this.fadeTimeout);
    }
  }

  imagesPromise(d: District, images: DistFile[]) {
    let promises = images.filter(img => img.file !== null).map(async (img, index) => {
      const result = await this.uploadImages(d, img.file, img.logo);
      return new Promise((res, rej) => {
        res(result)
      })
    });
    Promise.all(promises)
      .then((results) => {
        this.router.navigate(['/district-home'], {state: {msg: 'MESSAGE.DISTRICT_ADDED'}});
      }).catch((e) => console.log("ERROR: ", e));
  }

  uploadImages = (d, image, logo) => {
    return new Promise((resolve, rej) => {
      this._service.upload(d.id, image, logo).subscribe(d2 => {
        resolve(d2);
      });
    })
  };

  private initMap(): void {
    // Map creation
    this.map = L.map('map-dist', {
      center: [40.860672, 14.268092],
      zoom: 10,
      editable: true,
      scrollWheelZoom: true
    });

    // Map association of openstreetmap
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);


    const whenClicked = (layer) => {
      let localGeo: Geo = new Geo();
      const feature = layer.target.feature;
      if (layer.target.options.fillColor === this.selectedFillColor) {
        layer.target.setStyle({fillColor: this.originalFillColor, color: this.originalColor});
        this.geos = this.geos.filter(g => g.properties.cityId !== feature.properties.id);
      } else {
        layer.target.setStyle({fillColor: this.selectedFillColor, color: this.selectedColor});
        localGeo.properties.cityId = feature.properties.id;
        localGeo.properties.showOnMap = true;
        localGeo.properties.additionalPopupContent = feature.properties.nome + ' (' + feature.properties.comune + ')';
        //localGeo.properties.color = "#0000ff";
        localGeo.geometry.type = 'MultiPolygon';

        // Invert lat and lng
        // feature.geometry.coordinates.forEach(multyPoligon => {
        //   multyPoligon.forEach(polygon => {
        //     polygon.forEach(point => {
        //       const temp = point[0];
        //       point[0] = point[1];
        //       point[1] = temp;
        //     });
        //   });
        // });


        localGeo.geometry.coordinates = JSON.stringify(feature.geometry.coordinates);
        this.geos.push(localGeo);
        layer.target.closePopup();
      }
    };

    const onEachFeature = (feature, layer) => {
      const popupContent = feature.properties.comune;
      layer.bindPopup(popupContent);

      const match: boolean = this.geos.some(g => g.properties.cityId === feature.properties.id);
      if (match) {
        layer.setStyle({fillColor: this.selectedFillColor, color: this.selectedColor});
      }

      layer.on({
        click: whenClicked,
        mouseover: (layer) => {
          layer.target.openPopup();
        },
        mouseout: (layer) => {
          if (!layer.originalEvent.relatedTarget.classList.contains("leaflet-popup-content-wrapper")) {
            layer.target.closePopup();
          }
        }
      });
    };

    this._u_service.itaLayer.subscribe(data => {
      L.geoJson(data, {
        onEachFeature: onEachFeature,
      }).addTo(this.map);
    });

    if (this.center !== null) {
      this.map.flyTo(new L.LatLng(this.center[1], this.center[0]), 10);
    }
  }

  private insertPolygonMap(): void {

    // When pressing CTRL + right mouse button, it is possible to delete an editable polygon
    const deleteShape = function (e) {
      if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
        this.editor.deleteShapeAt(e.latlng);
      }
    };

    const coords = this.district.get('geo').value.geometry.coordinates;
    const poly = L.polygon(coords).addTo(this.map);
    poly.enableEdit();
    poly.on('click', L.DomEvent.stop).on('click', deleteShape);
    poly.on('dblclick', L.DomEvent.stop).on('dblclick', poly.toggleEdit);
    this.map.flyTo(new L.LatLng(coords[0][0][0], coords[0][0][1]), 12); // Move the map

  }

}
