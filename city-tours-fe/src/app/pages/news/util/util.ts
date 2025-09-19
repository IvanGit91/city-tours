export namespace Util {


  export interface INewsItem {

    id: number;
    title: string;
    description: string;
    description_extended: string;
    publicationDate: string;
    approval_date: string;
    pathImage: string;
    author: string;
  }

  export class INews implements INewsItem {

    constructor(id: number, title: string, description: string, description_extended: string, publication_date: string,
                approval_date: string, pathImage: string, author: string) {

      this._id = id;
      this._title = title;
      this._description = description;
      this._description_extended = description_extended;
      this._publicationDate = publication_date;
      this._approval_date = approval_date;
      this._pathImage = pathImage;
      this._author = author;


    }

    private _id: number;

    get id(): number {
      return this._id;
    }

    set id(id: number) {
      this._id = id;
    }

    private _title: string;

    get title(): string {
      return this._title;
    }

    set title(title: string) {
      this._title = title;
    }

    private _description: string;

    get description(): string {
      return this._description;
    }

    set description(description: string) {
      this._description = description;
    }

    private _description_extended: string;

    get description_extended(): string {
      return this._description_extended;
    }

    set description_extended(description_extended: string) {
      this._description_extended = description_extended;
    }

    private _publicationDate: string;

    set publicationDate(publication_date: string | null) {
      this._publicationDate = publication_date;
    }

    private _approval_date: string;

    get approval_date(): string {
      return this._approval_date;
    }

    set approval_date(approval_date: string) {
      this._approval_date = approval_date;
    }

    private _pathImage: string;

    get pathImage(): string {
      return this._pathImage;
    }

    set pathImage(pathImage: string) {
      this._pathImage = pathImage;
    }

    private _author: string;

    get author(): string {
      return this.author;
    }

    set author(author: string) {
      this._author = author;
    }

  }
}
