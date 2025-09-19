export class TypizedFile {

  file: string;
  contentType: string;

  constructor() {
  }

  public static toBase64Image(r: TypizedFile): string {
    return r != null && r.contentType != null ? "data:image/" + r.contentType + ";base64," + r.file : null;
  }
}
