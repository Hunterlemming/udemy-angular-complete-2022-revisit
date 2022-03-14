import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('f') signupForm: NgForm;

  defaultQuestion: string = 'pet';
  answer: string;
  genders = ['male', 'female'];
  user = {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  }
  submitted: boolean = false;

  suggestUserName() {
    const suggestedName = 'Superuser';
    // this.signupForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // });
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }

  // onSubmit(form: NgForm): void {
  //   console.log(form.value);
  // }

  // onSubmit(): void {
  //   console.log(this.signupForm.valid);
  // }

  onSubmit(): void {
    this.submitted = true;

    const submittedForm = this.signupForm.value;
    this.user.username = submittedForm.userData.username;
    this.user.email = submittedForm.userData.email;
    this.user.secretQuestion = submittedForm.secret;
    this.user.answer = submittedForm.questionAnswer;
    this.user.gender = submittedForm.gender;

    this.signupForm.reset();
  }
}
