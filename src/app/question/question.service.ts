import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import * as urljoin from 'url-join';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuestionService {
  private questionsUrl: string;

  constructor(private http: Http) {
    this.questionsUrl = `${environment.apiUrl}/questions`;
  }

  getQuestions(sort = '-createdAt'): Promise<void | Question[]> {
    return this.http.get(`${this.questionsUrl}?sort=${sort}`)
    .toPromise()
    .then(response => response.json() as Question[])
    .catch(this.handleError);
  }

  getQuestion(id): Promise<void | Question> {
    const url = urljoin(this.questionsUrl, id);
    return this.http.get(url)
    .toPromise()
    .then(response => response.json() as Question)
    .catch(this.handleError);
  }

  addQuestion(question: Question) {
    const body = JSON.stringify(question);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const url = this.questionsUrl;
    const token = this.getToken();

    return this.http.post(url + token, body, { headers })
    .map((response: Response) => response.json())
    .catch((error: Response) =>  Observable.throw(error.json()));
  }

  getToken() {
    const token = localStorage.getItem('token');
    return `?token=${token}`;
  }

  addAnswer(answer: Answer) {
    const a = {
      description: answer.description
    };
    const body = JSON.stringify(a);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const url = urljoin(this.questionsUrl, answer.question._id.toString(), 'answers');
    const token = this.getToken();
    return this.http.post(url + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  handleError(error: any) {
    const errMsg = error.message ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server Error';
      console.log(errMsg);
  }
}