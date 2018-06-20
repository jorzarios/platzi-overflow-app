import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Answer } from './answer.model';
import { Question } from '../question/question.model';
import { User } from '../auth/user.model';
import { QuestionService } from '../question/question.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import * as SmoothScroll from 'smooth-scroll';

 @Component({
   selector: 'app-answer-form',
   templateUrl: './answer-form.component.html',
   styles: [`
        margin-top: 20px;
      }
     `]
 })

 export class AnswerFormComponent {
    @Input() question: Question;
    SmoothScroll: SmoothScroll;

    constructor(
      private questionService: QuestionService,
      private authService: AuthService,
      private router: Router
    ) {
      this.SmoothScroll = new SmoothScroll();
    }

   onSubmit(form: NgForm) {
     if (!this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/signin');
     }
     const answer = new Answer (
        form.value.description,
        this.question,
        new Date(),
        new User(null, null, 'Jorge', 'Zamudio')
     );

     this.questionService.addAnswer(answer)
      .subscribe(
        a => {
          this.question.answers.unshift(a);
          const anchor = document.querySelector( '#title' );
          this.SmoothScroll.animateScroll(anchor);
        },
        this.authService.handleError
      );
     form.reset();
   }
 }
