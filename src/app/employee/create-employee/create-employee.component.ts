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

  requiredDomainName = 'dell.com';

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
  };

  formErrors: any = {};

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
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })

    this.employeeForm.get('contactPreference')?.valueChanges
      .subscribe(data => {
        this.onContactPrefernceChange(data);
      })

    this.employeeForm.valueChanges.subscribe(() => {
      this.logValidationErrors(this.employeeForm);
    })
  }

  addSkillButtonClicked() {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup())
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    })
  }

  getSkillFormControls() {
    return (this.employeeForm.get('skills') as FormArray).controls
  }

  getStatus(group: any, key: any) {
    const g = group.get(key);
    return g && g.invalid && g.touched
  }

  getErrors(group: any, key: any) {
    const g = group.get(key);
    return g && g.touched && g.errors && g.errors['required']
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
    const phoneFormControl = this.employeeForm.get('phone');

    const emailFormGroup = this.employeeForm.get('emailGroup');
    const emailFormControl = emailFormGroup?.get('email');
    const confirmEmailFormControl = emailFormGroup?.get('confirmEmail');

    if (selectedContactType === 'phone') {
      emailFormControl?.clearValidators();
      confirmEmailFormControl?.clearValidators();
      phoneFormControl?.setValidators(Validators.required);
    } else if (selectedContactType === 'email') {
      emailFormControl?.setValidators([Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]);
      confirmEmailFormControl?.setValidators([Validators.required, CustomValidator.emailDomain(this.requiredDomainName)]);
      phoneFormControl?.clearValidators();
    }
    emailFormControl?.updateValueAndValidity();
    confirmEmailFormControl?.updateValueAndValidity();
    phoneFormControl?.updateValueAndValidity();
  }

  onLoadData() {
    const formArray = new FormArray([
      new FormControl('John', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required),
      }),
      new FormArray([]),
    ]);

    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required),
    ]);

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
