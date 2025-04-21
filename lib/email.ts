import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Bond Portfolio" <noreply@bondfolio.com>',
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateOrderConfirmationEmail(order: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0284c7;">Potvrzení objednávky dluhopisu</h1>
      <p>Děkujeme za Váš zájem o nákup dluhopisů prostřednictvím platformy BondFolio.</p>
      <h2 style="color: #0284c7;">Detaily objednávky</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Název dluhopisu:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.bondName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Výše investice:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Datum objednávky:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleDateString('cs-CZ')}</td>
        </tr>
      </table>
      <p>Investiční partner Vás bude v brzké době kontaktovat pro dokončení Vašeho nákupu.</p>
      <p>Pokud máte jakékoliv dotazy, kontaktujte prosím náš zákaznický servis.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>BondFolio - Vaše důvěryhodná platforma pro investice do dluhopisů</p>
      </div>
    </div>
  `;
}

export function generatePartnerNotificationEmail(order: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0284c7;">Nová objednávka dluhopisu</h1>
      <p>Byla vytvořena nová objednávka na jeden z vašich dluhopisů.</p>
      <h2 style="color: #0284c7;">Detaily objednávky</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Název dluhopisu:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.bondName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Výše investice:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Datum objednávky:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleDateString('cs-CZ')}</td>
        </tr>
      </table>
      <h2 style="color: #0284c7;">Informace o zákazníkovi</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Jméno:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telefon:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.phone}</td>
        </tr>
        ${order.birthDate ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Datum narození:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.birthDate}</td>
        </tr>` : ''}
        ${order.permanentAddress ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Trvalá adresa:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.permanentAddress}</td>
        </tr>` : ''}
        ${order.correspondenceAddress ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Korespondenční adresa:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.correspondenceAddress}</td>
        </tr>` : ''}
        ${order.bankAccount ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Číslo bankovního účtu:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.bankAccount}</td>
        </tr>` : ''}
        ${order.personalId ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Rodné číslo:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.personalId}</td>
        </tr>` : ''}
      </table>
      ${order.message ? `
      <h2 style="color: #0284c7;">Zpráva od zákazníka</h2>
      <p>${order.message}</p>` : ''}
      <p>Kontaktujte prosím zákazníka co nejdříve pro dokončení procesu nákupu.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>BondFolio - Vaše důvěryhodná platforma pro investice do dluhopisů</p>
      </div>
    </div>
  `;
}
