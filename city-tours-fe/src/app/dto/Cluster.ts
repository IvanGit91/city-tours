export class Cluster {

  poiId: number;
  latlng: number[];
  icon: any;
  popup: string;


  constructor(poiId, latlng, icon, popup) {
    this.poiId = poiId;
    this.latlng = latlng;
    this.icon = icon;
    this.popup = popup;
  }
}
