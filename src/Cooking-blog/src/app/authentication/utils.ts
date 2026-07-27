import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(
    control: AbstractControl
): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(value)
        ? null
        : { email: true };
}

export function fullNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    return regex.test(control.value) ? null : { fullname: true };
}

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null
    }

    if (!/^\d{9}$/.test(value)) {
        return {
            phoneNumber: true,
        }
    }
    return null;
}

export function articleHeadlineValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null
    }

    if (!/\S/.test(value)) {
        return {
            articleHeadline: true,
        }
    }
    return null;
}

export function articleContentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null
    }

    if (!/\S/.test(value)) {
        return {
            articleContent: true,
        }
    }
    return null;
}

export function articleImageValidator(
    control: AbstractControl
): ValidationErrors | null {
    const value = control.value?.trim();

    // Image URL is optional
    if (!value) {
        return null;
    }

    if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
        return {
            articleImage: true,
        };
    }

    return null;
}

export function passwordMatch(passwordFormControl: AbstractControl) {
    const validtorFn: ValidatorFn = (rePasswordFormControl: AbstractControl) => {
        if (passwordFormControl.value !== rePasswordFormControl.value) {
            return {
                passwordMissmatch: true
            }
        }

        return null;
    }

    return validtorFn;
}
