import { ErrorResponseType, SuccessResponseType } from '../../types';
import MailService from './mail.service';

class MailServiceUtilities {
  static async sendAccountCreationEmail({
    to,
    firstname,
  }: {
    to: string;
    firstname: string;
  }): Promise<SuccessResponseType<void> | ErrorResponseType> {
    const subject = 'Welcome to Our Service';
    const htmlTemplate = 'welcome';
    const templateData = { firstname };

    return await MailService.sendMail({
      to,
      subject,
      htmlTemplate,
      templateData,
    });
  }
}

export default MailServiceUtilities;
