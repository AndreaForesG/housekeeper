import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {PlansService} from "../../services/plans.service";
import {loadStripe, Stripe, StripeCardElement, StripeElements} from "@stripe/stripe-js";
import {environment} from "../../../environments/environment";
import {StripeService} from "../../services/stripe.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  registerForm!: FormGroup;
  errorMessage: string = "";
  plans: any;
  selectedPlan: any;
  stripe!: Stripe;
  elements!: StripeElements;
  card!: StripeCardElement;
  cardError: string | null = null;
  isLoading: boolean = false;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private notificationService: NotificationService,
              private plansService: PlansService,
              private stripeService: StripeService,
              private router: Router,
              private http: HttpClient) {

  }
  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
    this.titleService.setTitle(data.title);
  });
    this.initForm();
    this.getPlans();
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      planId: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  async ngAfterViewInit() {
    const stripeInstance = await loadStripe(environment.stripePublishableKey);
    if (!stripeInstance) {
      throw new Error('Stripe no se pudo cargar correctamente');
    }
    this.stripe = stripeInstance;

    this.elements = await this.stripe.elements();
    this.card = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': {
            color: '#a0aec0',
          },
        },
        invalid: {
          color: '#e53e3e',
        },
      },
    });

    this.card.mount('#card-element');

    this.card.on('change', (event) => {
      this.cardError = event.error ? event.error.message : null;
    });
  }



  async onSubmit() {
    if (this.registerForm.invalid || !this.selectedPlan) return;
    this.isLoading = true;

    try {
      const paymentIntentResponse = await this.stripeService.createPaymentIntent({
        amount: this.selectedPlan.price * 100,
        currency: 'eur',
        planId: this.selectedPlan.id,
      }).toPromise();

      if(!paymentIntentResponse?.clientSecret) {
        this.isLoading = false;
       return;
      }

      const clientSecret = paymentIntentResponse.clientSecret;
      const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: this.registerForm.value.name,
            email: this.registerForm.value.email,
          },
        },
      });

      if (error || !paymentIntent || paymentIntent.status !== 'succeeded') {
        this.errorMessage = error?.message || 'Error al procesar el pago';
        this.isLoading = false;
        return;
      }

      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        planId: this.selectedPlan.id,
        paymentIntentId: paymentIntent.id,
      };

      this.authService.register(formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Usuario registrado correctamente. Puede iniciar Sesión.');
          this.authService.downloadInvoice(formData).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'factura.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          });


          this.registerForm.reset();
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error al registrarse';
          this.notificationService.showError('Error al registrarse');
          this.isLoading = false;
        }
      });

    } catch (err) {
      this.errorMessage = 'Error inesperado. Intenta de nuevo.';
      this.notificationService.showError('Error inesperado. Intenta de nuevo.');
      this.isLoading = false;
    }
  }


  getPlans() {
    this.plansService.getAllPlans().subscribe(resp => {
      this.plans = resp;
    })
  }


  choosePlan(plan: any) {
    this.selectedPlan = plan;
    this.registerForm.patchValue({ planId: plan.id });
  }
}
