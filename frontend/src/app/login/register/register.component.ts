import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string = "";

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private notificationService: NotificationService) {

  }
  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
    this.titleService.setTitle(data.title);
  });
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Usuario registrado correctamente');
        this.registerForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al registrarse';
      },
    });
  }


}
