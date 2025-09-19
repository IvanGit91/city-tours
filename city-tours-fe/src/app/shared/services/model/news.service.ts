import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigService} from '../../index';
import {News} from "../../../model/News";
import {HttpClient} from "@angular/common/http";
import {PageableNews} from "../../../model/PageableNews";
import {BaseService} from 'src/app/shared/services/model/base.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends BaseService<News> {

  constructor(_config: ConfigService, http: HttpClient) {
    super(_config, http, 'news');
  }

  getNews(idNews: number): Observable<News> {
    const url = this.apiUrl + `/${idNews}`;
    return this.http.get<News>(url);
  }

  getAllNews(): Observable<News[]> {
    const url = this.apiUrl + `/`;
    return this.http.get<News[]>(url);
  }

  getAllNews2(): Observable<News[]> {
    const url = this.apiUrl + `/`;
    return this.http.get<News[]>(url);
  }

  createNews(news: News): Observable<News> {
    const url = this.apiUrl + this.authUrl + `/`;
    return this.http.post<News>(url, news);
  }

  updateNews(idNews: number, news: News): Observable<News> {
    const url = this.apiUrl + this.authUrl + `/${idNews}`;
    return this.http.put<News>(url, news);
  }

  setImage(idNews: number, file: File): Observable<News> {
    const url = this.apiUrl + this.authUrl + `/upload/${idNews}`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<News>(url, formData);
  }

  setApprovalDate(idNews: number, news: News): Observable<News> {
    const url = this.apiUrl + this.authUrl + `/setDate/${idNews}`;
    return this.http.put<News>(url, {});
  }

  getAllNewsPageable(page: number, size: number): Observable<PageableNews> {
    const url = this.apiUrl + `/pageable?page=${page}&size=${size}`;
    return this.http.get<PageableNews>(url);
  }

  getAllByRedactorId(idNews: number): Observable<News[]> {
    const url = this.apiUrl + this.authUrl + `/redactor/${idNews}`;
    return this.http.get<News[]>(url);
  }

  getAllNewsByApprovalDate(): Observable<News[]> {
    const url = this.apiUrl + `/newsByApprovalDate`;
    return this.http.get<News[]>(url);
  }

}
