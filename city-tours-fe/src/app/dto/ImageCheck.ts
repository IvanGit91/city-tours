export class ImageCheck {

  maxSize: number;  //In KB
  maxWidth: number;
  maxHeight: number;
  message: string;
  messageMax: number;

  constructor(maxSize: number, maxWidth: number, maxHeight: number) {
    this.maxSize = maxSize;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }
}
