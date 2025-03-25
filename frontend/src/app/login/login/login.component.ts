import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password);
  }
}
