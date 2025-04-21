'use client';
import { useState, useRef, useEffect } from 'react';
import { parsePDF } from '@/lib/pdf-parser';
import { useParams } from 'next/navigation';
import { useTranslation } from './TranslationProvider';
import { useCsrfToken } from '@/lib/csrf';

// Konstanty pro výčtové hodnoty
export enum PaymentSchedule {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi-annual',
  ANNUAL = 'annual',
  ANNUALLY = 'annually',
}

interface BondFormData {
  companyName: string;
  purchaseDate: string;
  maturityDate: string;
  investedAmount: string;
  interestRate: string;
  paymentSchedule: PaymentSchedule | string;
  paymentDay: string;
  pdfFile?: File;
}

// Komponenta pro notifikace
const Notification = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => {
  return (
    // Přidání role="alert" pro lepší dostupnost a testovatelnost
    <div role="alert" className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className="flex items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

interface BondFormProps {
  bondToEdit?: {
    id: string;
    company_name: string;
    purchase_date: string;
    maturity_date: string;
    invested_amount: number;
    interest_rate: number;
    payment_schedule: string;
    payment_day?: string;
    pdf_url?: string;
  } | null;
}

export default function BondForm({ bondToEdit = null }: BondFormProps) {
  const { locale } = useParams() as { locale: string };
  const { translate } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  // Použití hooku useCsrfToken pro získání tokenu
  const csrfToken = useCsrfToken(); // Získání tokenu z hooku

  // Odebrán useEffect pro manuální nastavování tokenu, protože hook by to měl řešit

  // Inicializace defaultních hodnot
  const getDefaultFormData = () => ({
    companyName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    investedAmount: '',
    interestRate: '',
    paymentSchedule: PaymentSchedule.QUARTERLY,
    paymentDay: '15' // Výchozí den výplaty je 15. den v měsíci
  });

  const [formData, setFormData] = useState<BondFormData>(getDefaultFormData());
  const [editMode, setEditMode] = useState(false);
  const [bondId, setBondId] = useState<string | null>(null);

  // Přidáme logování při inicializaci komponenty
  console.log('BondForm: Komponenta inicializována, bondToEdit:', bondToEdit);

  // Načtení dat dluhopisu při editaci
  useEffect(() => {
    console.log('BondForm: useEffect pro bondToEdit spuštěn, bondToEdit:', bondToEdit);

    if (bondToEdit) {
      console.log('BondForm: Načtení dat dluhopisu pro editaci:', bondToEdit);
      setEditMode(true);
      setBondId(bondToEdit.id);

      // Vytvoření nového objektu s daty formuláře
      const newFormData = {
        companyName: bondToEdit.company_name,
        purchaseDate: bondToEdit.purchase_date,
        maturityDate: bondToEdit.maturity_date,
        investedAmount: bondToEdit.invested_amount.toString(),
        interestRate: bondToEdit.interest_rate.toString(),
        paymentSchedule: bondToEdit.payment_schedule,
        paymentDay: bondToEdit.payment_day || '15'
        // pdfFile je volitelné, nemusíme ho nastavovat
      };

      console.log('BondForm: Nová data formuláře pro editaci:', newFormData);
      setFormData(newFormData);
      console.log('BondForm: Formulář nastaven pro editaci, editMode:', true, 'bondId:', bondToEdit.id);

      // Otevřeme dialog pro editaci
      setTimeout(() => {
        if (dialogRef.current) {
          console.log('BondForm: Otevírám dialog pro editaci');
          dialogRef.current.showModal();
        } else {
          console.error('BondForm: Dialog pro editaci nebyl nalezen');
        }
      }, 100); // Malé zpoždění pro jistotu
    } else {
      console.log('BondForm: Resetování formuláře pro nový dluhopis');
      setEditMode(false);
      setBondId(null);
      setFormData(getDefaultFormData());
    }
  }, [bondToEdit]);

  // Nastavení titulku formuláře podle režimu
  const formTitle = editMode ? 'Upravit dluhopis' : 'Přidat nový dluhopis';

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validace typu souboru
    if (file.type !== 'application/pdf') {
      setNotification({
        message: translate('bondForm.invalidFileType', locale, { defaultValue: 'Only PDF files are allowed' }),
        type: 'error'
      });
      return;
    }

    // Validace velikosti souboru (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setNotification({
        message: translate('bondForm.fileTooLarge', locale, { defaultValue: 'File is too large (max 10MB)' }),
        type: 'error'
      });
      return;
    }

    try {
      const parsedData = await parsePDF(file);
      setFormData(prev => ({
        ...prev,
        ...parsedData,
        pdfFile: file
      }));
    } catch (error) {
      setNotification({
        message: translate('bondForm.pdfError', locale, { defaultValue: 'Error parsing PDF' }) + ': ' + (error as Error).message,
        type: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('BondForm: Zahájení odesílání formuláře, editMode:', editMode, 'bondId:', bondId);
    setIsSubmitting(true);

    const formPayload = new FormData();
    // Manuálně přidáme každé pole samostatně pro lepší kontrolu
    formPayload.append('companyName', formData.companyName);
    formPayload.append('purchaseDate', formData.purchaseDate);
    formPayload.append('maturityDate', formData.maturityDate);
    formPayload.append('investedAmount', formData.investedAmount);
    formPayload.append('interestRate', formData.interestRate);
    formPayload.append('paymentSchedule', formData.paymentSchedule);
    formPayload.append('paymentDay', formData.paymentDay);

    // Přidání CSRF tokenu
    if (csrfToken) {
      formPayload.append('csrfToken', csrfToken);
    }

    // Přidání ID dluhopisu při editaci
    if (editMode && bondId) {
      console.log('BondForm: Přidávám ID dluhopisu pro editaci:', bondId);
      formPayload.append('id', bondId);
    }

    // Přidání PDF souboru, pokud byl vybrán
    if (formData.pdfFile) {
      console.log('BondForm: Přidávám PDF soubor:', formData.pdfFile.name);
      formPayload.append('pdf', formData.pdfFile);
    }

    // Výpis všech klíčů ve formuláři pro diagnostiku
    const formKeys: string[] = [];
    formPayload.forEach((_value, key) => {
      formKeys.push(key);
    });
    console.log('BondForm: Klíče ve formuláři:', formKeys);

    try {
      console.log("BondForm: Odesílám formulář s CSRF tokenem:", csrfToken ? "Present" : "Missing");
      console.log("BondForm: Hodnoty formuláře:", {
        companyName: formData.companyName,
        purchaseDate: formData.purchaseDate,
        maturityDate: formData.maturityDate,
        investedAmount: formData.investedAmount,
        interestRate: formData.interestRate,
        paymentSchedule: formData.paymentSchedule,
        paymentDay: formData.paymentDay,
        hasPdfFile: !!formData.pdfFile,
        editMode: editMode,
        bondId: bondId
      });

      // Použití správné cesty API s lokalizací
      const url = editMode && bondId ? `/api/bonds/${bondId}` : '/api/bonds';
      const method = editMode ? 'PUT' : 'POST';

      console.log(`BondForm: ${editMode ? 'Aktualizuji' : 'Vytvářím'} dluhopis na ${url}, metoda: ${method}`);

      const response = await fetch(url, {
        method: method,
        // Vypnout CSRF token dočasně pro diagnostiku
        // headers: {
        //   'X-CSRF-Token': csrfToken
        // },
        body: formPayload
      });

      console.log('BondForm: API odpověď status:', response.status, response.statusText);

      if (!response.ok) {
        console.error("BondForm: Response not OK:", response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error("BondForm: Error details:", errorData);
          throw new Error(errorData.message || errorData.error || 'Submission failed');
        } catch (parseError) {
          console.error("BondForm: Failed to parse error response:", parseError);
          throw new Error(`API error (${response.status}): ${response.statusText}`);
        }
      }

      // Pokus o získání dat z odpovědi
      const responseData = await response.json();
      console.log('BondForm: Úspěšná odpověď API:', responseData);

      setNotification({
        message: editMode
          ? 'Dluhopis byl úspěšně upraven!'
          : 'Dluhopis byl úspěšně přidán!',
        type: 'success'
      });

      // Reset formuláře pomocí funkce pro inicializaci výchozích hodnot
      setFormData(getDefaultFormData());
      dialogRef.current?.close();

      // Aktualizace stránky pro zobrazení nového dluhopisu a aktualizaci grafů
      window.location.reload();
    } catch (error) {
      console.error('Submission error:', error);
      setNotification({
        message: translate('bondForm.error', locale, { defaultValue: 'Failed to add bond. Please try again.' }),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Přeložené texty
  const texts = {
    title: translate('bondForm.title', locale, { defaultValue: 'Nová investice do dluhopisu' }),
    editTitle: translate('bondForm.editTitle', locale, { defaultValue: 'Upravit dluhopis' }),
    companyName: translate('bondForm.companyName', locale, { defaultValue: 'Název společnosti' }),
    purchaseDate: translate('bondForm.purchaseDate', locale, { defaultValue: 'Datum nákupu' }),
    maturityDate: translate('bondForm.maturityDate', locale, { defaultValue: 'Datum splatnosti' }),
    investedAmount: translate('bondForm.investedAmount', locale, { defaultValue: 'Investovaná částka (Kč)' }),
    interestRate: translate('bondForm.interestRate', locale, { defaultValue: 'Úroková sazba (%)' }),
    paymentSchedule: translate('bondForm.paymentSchedule', locale, { defaultValue: 'Plán plateb' }),
    paymentDay: translate('bondForm.paymentDay', locale, { defaultValue: 'Den výplaty' }),
    uploadPdf: translate('bondForm.uploadPdf', locale, { defaultValue: 'Nahrát PDF smlouvu (volitelné)' }),
    cancel: translate('bondForm.cancel', locale, { defaultValue: 'Zrušit' }),
    save: translate('bondForm.save', locale, { defaultValue: 'Uložit dluhopis' }),
    monthly: translate('bondForm.monthly', locale, { defaultValue: 'Měsíčně' }),
    quarterly: translate('bondForm.quarterly', locale, { defaultValue: 'Čtvrtletně' }),
    semiAnnual: translate('bondForm.semiAnnual', locale, { defaultValue: 'Pololetně' }),
    annual: translate('bondForm.annual', locale, { defaultValue: 'Ročně' })
  };

  // Mapování mezi enum PaymentSchedule a přeloženými texty
  const paymentScheduleOptions = [
    { value: PaymentSchedule.MONTHLY, label: texts.monthly },
    { value: PaymentSchedule.QUARTERLY, label: texts.quarterly },
    { value: PaymentSchedule.SEMI_ANNUAL, label: texts.semiAnnual },
    { value: PaymentSchedule.ANNUAL, label: texts.annual },
    { value: PaymentSchedule.ANNUALLY, label: texts.annual }
  ];

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <dialog ref={dialogRef} id="bond-modal" className="rounded-lg shadow-xl">
        <div className="p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{formTitle}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block mb-2">{texts.companyName}</label>
              <input
                id="companyName"
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="purchaseDate" className="block mb-2">{texts.purchaseDate}</label>
                <input
                  id="purchaseDate"
                  type="date"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="maturityDate" className="block mb-2">{texts.maturityDate}</label>
                <input
                  id="maturityDate"
                  type="date"
                  required
                  className="w-full p-2 border rounded-md"
                  min={formData.purchaseDate} // Zajistí, že datum splatnosti je po datu nákupu
                  value={formData.maturityDate}
                  onChange={e => setFormData({...formData, maturityDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="investedAmount" className="block mb-2">{texts.investedAmount}</label>
                <input
                  id="investedAmount"
                  data-testid="investedAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.investedAmount}
                  onChange={e => setFormData({...formData, investedAmount: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="interestRate" className="block mb-2">{texts.interestRate}</label>
                <input
                  id="interestRate"
                  data-testid="interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.interestRate}
                  onChange={e => setFormData({...formData, interestRate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="paymentSchedule" className="block mb-2">{texts.paymentSchedule}</label>
                <select
                  id="paymentSchedule"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.paymentSchedule}
                  onChange={e => setFormData({...formData, paymentSchedule: e.target.value})}
                >
                  {paymentScheduleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentDay" className="block mb-2">{texts.paymentDay}</label>
                <select
                  id="paymentDay"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.paymentDay}
                  onChange={e => setFormData({...formData, paymentDay: e.target.value})}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day.toString()}>
                      {day}. den v měsíci
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="pdfFile" className="block mb-2">{texts.uploadPdf}</label>
              <input
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                disabled={isSubmitting}
              >
                {texts.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Načítání...' :
                 editMode ? 'Uložit změny' : 'Uložit dluhopis'
                }
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
