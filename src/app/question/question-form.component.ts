import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from './question.model';
import icons from './icons';
import { QuestionService } from './question.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styles: [`
    i {
      font-size: 40px;
    }

    small {
      display: block;
    }
    `],
    providers: [QuestionService]
})

export class QuestionFormComponent implements OnInit {
  icons: Object[] = icons;
  selectedIcon: 'none';
  iconVersion?: any;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router
  ) {}

  getIconVersion(icon: any) {
    let version;
    if (icon.versions.font.includes('plain-wordmark')) {
      version = 'plain-wordmark';
    } else {
      version = icon.versions.font[0];
    }
    return version;
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
       this.router.navigateByUrl('/signin');
    }
  }

  onClick(icon) {
   this.selectedIcon = icon;
   const version = this.getIconVersion(icons.find((i) => i.name === icon));
   this.iconVersion = `${this.selectedIcon}-${version}`;
 }

  onSubmit(form: NgForm) {

    const q = new Question(
      form.value.title,
      form.value.description,
      new Date(),
      this.iconVersion
    );
    this.questionService.addQuestion(q)
      .subscribe(
        ({ _id }) => this.router.navigate(['/questions', _id]),
        this.authService.handleError
      );
      form.resetForm();
  }
}
