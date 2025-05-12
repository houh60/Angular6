import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../shared/custom.validator';

@Component({
  selector: 'app-create-employee',
  standalone: false,
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;

  validationMessages: any = {
    fullName: {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 15 characters.'
    },
    email: {
      'required': 'Email is required.',
      'emailDoman': 'Email domain should be dell.com'
    },
    confirmEmail: {
      'required': 'Confirm Email is required.',
      'emailDoman': 'Email domain should be dell.com'
    },
    emailGroup: 'Email and confirm email do not match',
    phone: {
      'required': 'Phone is required.'
    },
    skillName: {
      'required': 'Skill Name is required.',
    },
    experienceInYears: {
      'required': 'Experience is required.',
    },
    proficiency: {
      'required': 'Proficiency is required.',
    },
  };

  formErrors: any = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': '',
    'confirmEmail': '',
    'emailGroup': ''
  };

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['intermediate']
      })
    })
  }

  getControlStatus(controName: string) {
    const el = this.employeeForm.get(controName);
    return el && (el.touched || el.dirty) && el.errors;
  }

  getErrorsRequired(controName: string) {
    const el = this.employeeForm.get(controName);
    return el && el.errors && el.errors['required'];
  }

  getErrorsLength(controName: string) {
    const el = this.employeeForm.get(controName);
    return el && el.errors && (el.errors['minlength'] || el.errors['maxlength']);
  }

  onLoadData() {
    // this.employeeForm.setValue({
    //   fullName: 'Pragim Technologies',
    //   email: 'pragim@pragimtech.com',
    //   skills: {
    //     skillName: 'C#',
    //     experienceInYears: 5,
    //     proficiency: 'beginner'
    //   }
    // });
    this.employeeForm.patchValue({
      fullName: 'Pragim Technologies',
      email: 'pragim@pragimtech.com',
      skills: {
        skillName: 'C#',
        experienceInYears: 5,
        proficiency: 'beginner'
      }
    });
  }

  onSubmit() {
    console.log("this.employeeForm: ", this.employeeForm);
  }
}
