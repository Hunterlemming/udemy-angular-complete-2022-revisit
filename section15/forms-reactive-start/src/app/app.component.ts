import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  //#region Properties

  genders: string[] = ['male', 'female'];
  signupForm: FormGroup;

  //#endregion

  //#region Variables

  private readonly forbiddenUsernames: string[] = ['Chris', 'Anna'];

  //#endregion

  //#region Public Methods

  getHobbyControls(): FormControl[] {
    let controls = (<FormArray>this.signupForm.get('hobbies')).controls;
    return controls as FormControl[];
  }

  onSubmit(): void {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby(): void {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }
  
  //#endregion

  //#region Private Methods

  private createSignupForm(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'name': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
      }),
      'gender': new FormControl(this.genders[0]),
      'hobbies': new FormArray([])
    });
  }

  private fillSignupForm(): void {
    this.signupForm.setValue({
      'userData': {
        'name': 'Christina',
        'email': 'asd@asd.com'
      },
      'gender': this.genders[1],
      'hobbies': []
    });
  }

  private patchSignupForm(): void {
    this.signupForm.patchValue({
      'userData': {
        'name': 'Chris'
      },
      'gender': this.genders[0]
    });
  }

  private forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) != -1) 
      return {'nameIsForbidden': true}
    return null;
  }

  private forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  //#endregion

  ngOnInit(): void {
    this.createSignupForm();
    /*this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );*/
    this.fillSignupForm();
    this.patchSignupForm();
  }

}
