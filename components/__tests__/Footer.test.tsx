import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { TranslationProvider } from '../TranslationProvider';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ href, children, className }) => {
    return (
      <a href={href} className={className} data-testid={`link-${href.replace(/\//g, '')}`}>
        {children}
      </a>
    );
  };
});

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/cs/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Mock TranslationProvider
jest.mock('../TranslationProvider', () => ({
  useTranslation: jest.fn().mockReturnValue({
    locale: 'cs',
    translate: (key) => key,
    setLocale: jest.fn()
  }),
  TranslationProvider: ({ children }) => <>{children}</>
}));

describe('Footer Component', () => {
  it('renders the footer with navigation links', () => {
    render(
      <TranslationProvider>
        <Footer />
      </TranslationProvider>
    );

    // Ověření, že footer obsahuje logo a slogan
    expect(screen.getByText('BondFolio')).toBeInTheDocument();
    expect(screen.getByText(/Your trusted platform for premium bond investments/)).toBeInTheDocument();

    // Ověření, že footer obsahuje navigační odkazy
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Listings')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();

    // Ověření, že footer obsahuje právní odkazy
    expect(screen.getByText('Legal')).toBeInTheDocument();

    // Ověření, že footer obsahuje newsletter formulář
    expect(screen.getByText('Newsletter')).toBeInTheDocument();
    expect(screen.getByText(/Subscribe to our newsletter for the latest investment opportunities/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Ověření, že footer obsahuje copyright
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} BondFolio. All rights reserved.`)).toBeInTheDocument();
  });
});