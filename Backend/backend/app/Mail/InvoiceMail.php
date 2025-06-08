<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;


class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userData;
    public $plan;


    /**
     * Create a new message instance.
     */
    public function __construct($userData, $plan)
    {
        $this->userData = $userData;
        $this->plan = $plan;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }


    public function build()
    {
        $pdf = Pdf::loadView('invoices.pdf', [
            'userData' => $this->userData,
            'plan' => $this->plan,
        ]);

        return $this->subject('Tu factura de suscripción')
            ->view('emails.invoice')
            ->attachData($pdf->output(), 'factura.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
