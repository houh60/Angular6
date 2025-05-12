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

  requiredDomainName = 'yahoo.com';

  validationMessages: any = {
    fullName: {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 15 characters.'
    },
    email: {
      'required': 'Email is required.',
      'emailDoman': `Email domain should be ${this.requiredDomainName}`
    },
    confirmEmail: {
      'required': 'Confirm Email is required.',
      'emailDoman': `Email domain should be ${this.requiredDomainName}`
    },
    emailGroup: {
      emailMismatch: 'Email and confirm email do not match'
    },
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
    fullName: '',
    emailGroup: '',
    email: '',
    emailMismatch: '',
    confirmEmail: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: '',
  };

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]],
        confirmEmail: ['', [Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]],
      }, { validator: matchEmail }),
      contactPreference: ['email'],
      phone: [''],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    })

    this.employeeForm.get('contactPreference')?.valueChanges
      .subscribe(data => {
        this.onContactPrefernceChange(data);
      })

    this.employeeForm.valueChanges.subscribe(() => {
      this.logValidationErrors(this.employeeForm);
    })
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      this.formErrors[key] = '';
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.invalid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  onContactPrefernceChange(selectedContactType: string) {
    const emailFormControl = this.employeeForm.get('email');
    const confirmEmailFormControl = this.employeeForm.get('confirmEmail');
    const phoneFormControl = this.employeeForm.get('phone');
    if (emailFormControl && confirmEmailFormControl && phoneFormControl) {
      if (selectedContactType === 'phone') {
        emailFormControl.clearValidators();
        confirmEmailFormControl.clearValidators();
        phoneFormControl.setValidators(Validators.required);
      } else if (selectedContactType === 'email') {
        emailFormControl.setValidators([Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]);
        confirmEmailFormControl.setValidators([Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]);
        phoneFormControl.clearValidators();
      }
      emailFormControl.updateValueAndValidity();
      confirmEmailFormControl.updateValueAndValidity();
      phoneFormControl.updateValueAndValidity();
    }
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
    // this.logValidationErrors(this.employeeForm);
    // console.log("this.formErrors: ", this.formErrors);
  }

  onSubmit() {
    console.log("this.employeeForm: ", this.employeeForm);
  }
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl?.value === confirmEmailControl?.value || confirmEmailControl?.pristine) {
    return null;
  }
  else {
    return { 'emailMismatch': true };
  }
}
