import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
} from '@react-email/components';

/**
 * TEMPLATES EMAILS TRANSACTIONNELS (REACT-EMAIL)
 * Design : Minimaliste, typos Serif, couleurs de la marque
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khashika.com';

interface WelcomeEmailProps {
  userName: string;
}

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Bienvenue chez Khashika</Heading>
          </Section>
          <Section style={content}>
            <Text style={text}>Bonjour {userName},</Text>
            <Text style={text}>
              Nous sommes ravis de vous accueillir dans l&apos;univers Khashika, 
              joaillerie indienne d&apos;exception depuis 1924.
            </Text>
            <Text style={text}>
              Découvrez notre collection de bijoux artisanaux en argent massif, 
              inspirés de la tradition indienne.
            </Text>
            <Section style={buttonContainer}>
              <Link href={`${baseUrl}/shop`} style={button}>
                Découvrir la Collection
              </Link>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Khashika. Tous droits réservés.
            </Text>
            <Text style={footerText}>
              <Link href={`${baseUrl}/contact`} style={link}>
                Contact
              </Link>{' '}
              |{' '}
              <Link href={`${baseUrl}/legal/cgv`} style={link}>
                CGV
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  userName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  orderNumber,
  userName,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Commande Confirmée</Heading>
            <Text style={orderNumberText}>Commande #{orderNumber}</Text>
          </Section>
          <Section style={content}>
            <Text style={text}>Bonjour {userName},</Text>
            <Text style={text}>
              Merci pour votre commande ! Nous avons bien reçu votre paiement 
              et votre commande est en cours de préparation.
            </Text>

            <Section style={orderSection}>
              <Heading style={h2}>Récapitulatif de votre commande</Heading>
              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemDetails}>
                    Quantité : {item.quantity} × {item.price.toFixed(2)} € ={' '}
                    {(item.quantity * item.price).toFixed(2)} €
                  </Text>
                </Section>
              ))}
              <Hr style={hr} />
              <Section style={totalRow}>
                <Text style={totalText}>Total : {total.toFixed(2)} €</Text>
              </Section>
            </Section>

            <Section style={addressSection}>
              <Heading style={h2}>Adresse de livraison</Heading>
              <Text style={text}>
                {shippingAddress.street}
                <br />
                {shippingAddress.zipCode} {shippingAddress.city}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>

            <Text style={text}>
              Vous recevrez un email de confirmation dès l&apos;expédition de votre commande.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Khashika. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

interface ShippedEmailProps {
  orderNumber: string;
  userName: string;
  trackingNumber?: string;
}

export function ShippedEmail({
  orderNumber,
  userName,
  trackingNumber,
}: ShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Votre bijou est en route !</Heading>
            <Text style={orderNumberText}>Commande #{orderNumber}</Text>
          </Section>
          <Section style={content}>
            <Text style={text}>Bonjour {userName},</Text>
            <Text style={text}>
              Excellente nouvelle ! Votre commande a été expédiée et devrait 
              vous parvenir sous peu.
            </Text>
            {trackingNumber && (
              <Section style={trackingSection}>
                <Text style={text}>
                  <strong>Numéro de suivi :</strong> {trackingNumber}
                </Text>
              </Section>
            )}
            <Text style={text}>
              Vous pouvez suivre votre colis en temps réel sur le site du transporteur.
            </Text>
            <Text style={text}>
              Nous espérons que vous serez ravi(e) de votre achat Khashika !
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Khashika. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#FDFBF7',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const header = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#FDFBF7',
  borderBottom: '2px solid #D4AF37',
};

const h1 = {
  color: '#2596be',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const content = {
  padding: '30px 20px',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const orderNumberText = {
  color: '#D4AF37',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#2596be',
  color: '#ffffff',
  padding: '12px 30px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const orderSection = {
  margin: '30px 0',
  padding: '20px',
  backgroundColor: '#FDFBF7',
  borderRadius: '4px',
};

const itemRow = {
  marginBottom: '15px',
};

const itemName = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const itemDetails = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const totalRow = {
  marginTop: '15px',
  textAlign: 'right' as const,
};

const totalText = {
  color: '#D4AF37',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const addressSection = {
  margin: '30px 0',
};

const trackingSection = {
  padding: '15px',
  backgroundColor: '#FDFBF7',
  borderRadius: '4px',
  margin: '20px 0',
};

const hr = {
  borderColor: '#D4AF37',
  margin: '30px 0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#FDFBF7',
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  margin: '5px 0',
  fontFamily: 'serif, Georgia, "Times New Roman", serif',
};

const link = {
  color: '#2596be',
  textDecoration: 'underline',
};















