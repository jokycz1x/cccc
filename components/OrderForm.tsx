'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface OrderFormProps {
  bondId: string;
  bondName: string;
  locale?: string;
}

export default function OrderForm({ bondId, bondName, locale = 'en' }: OrderFormProps) {
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Lokalizované texty
  const texts = {
    en: {
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      birthDate: 'Date of Birth',
      permanentAddress: 'Permanent Address',
      correspondenceAddress: 'Correspondence Address',
      bankAccount: 'Bank Account Number',
      personalId: 'Personal ID Number (Optional)',
      amount: 'Investment Amount (Kč)',
      message: 'Message (Optional)',
      gdprConsent: 'I consent to the processing of my personal data',
      termsConsent: 'I agree to the terms and conditions',
      placeOrder: 'Submit Order',
      submitting: 'Submitting...',
      placeAnother: 'Place Another Order',
      successTitle: 'Order Submitted Successfully',
      successMessage: 'Thank you for your interest in',
      contactSoon: 'An investment partner will contact you shortly to complete your purchase.',
      errorFields: 'Please fill in all required fields',
      tryAgain: 'Please try again or contact support',
      serverError: 'Server error occurred',
      connectionError: 'Connection error, please check your internet connection',
      comingSoon: 'Coming Soon',
      inDevelopment: 'The order creation feature is currently under development. Thank you for your patience.',
      contactInfo: 'Please contact us for more information about this offering.'
    },
    cs: {
      fullName: 'Celé jméno',
      email: 'Emailová adresa',
      phone: 'Telefonní číslo',
      birthDate: 'Datum narození',
      permanentAddress: 'Trvalá adresa',
      correspondenceAddress: 'Korespondenční adresa',
      bankAccount: 'Číslo bankovního účtu',
      personalId: 'Rodné číslo (nepovinné)',
      amount: 'Výše investice (Kč)',
      message: 'Zpráva (volitelné)',
      gdprConsent: 'Souhlasím se zpracováním osobních údajů',
      termsConsent: 'Beru na vědomí obchodní podmínky',
      placeOrder: 'Odeslat poptávku',
      submitting: 'Odesílám...',
      placeAnother: 'Zadat další poptávku',
      successTitle: 'Poptávka úspěšně odeslána',
      successMessage: 'Děkujeme za váš zájem o',
      contactSoon: 'Investiční konzultant vás bude brzy kontaktovat ohledně dokončení vaší investice.',
      errorFields: 'Vyplňte prosím všechna povinná pole',
      tryAgain: 'Zkuste to prosím znovu nebo kontaktujte podporu',
      serverError: 'Došlo k chybě na serveru',
      connectionError: 'Chyba připojení, zkontrolujte prosím své připojení k internetu',
      comingSoon: 'Připravujeme',
      inDevelopment: 'Funkce pro vytváření objednávek je momentálně ve vývoji. Děkujeme za trpělivost.',
      contactInfo: 'Pro získání více informací o této nabídce nás prosím kontaktujte.'
    }
  };

  // Vybereme správnou jazykovou verzi
  const t = locale === 'cs' ? texts.cs : texts.en;

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-green-800">{t.successTitle}</h3>
        </div>
        <div className="text-sm text-green-700">
          <p>{t.successMessage} <strong>{bondName}</strong>.</p>
          <p className="mt-2">{t.contactSoon}</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="btn-secondary w-full"
          >
            {t.placeAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 p-8 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
            <svg className="h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-medium text-yellow-800 mb-2">{t.comingSoon}</h3>
        <p className="text-yellow-700 mb-6">
          {t.inDevelopment}
        </p>
        <p className="text-sm text-yellow-600">
          {t.contactInfo}
        </p>
      </div>
    </div>
  );
}
