export type Email = {
  to: string;
  subject: string;
  html: string;
  bcc: string;
  replyTo: EmailData;
  from: EmailData;
  attachments: Attachment[];
};

type Attachment = {
  filename: string;
  content: string;
  disposition: 'attachment';
  type: 'application/pdf';
};

type EmailData = {
  email: string;
  name: string;
};

type SendOfferEmailRequest = {
  type: 'offer' | 'invoice' | 'refusal';
  to: string;
  subject: string;
  variables: {
    [key: string]: string;
  };
  attachment: {
    filename: string;
    content: string;
  };
};
