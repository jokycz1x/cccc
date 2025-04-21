import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../Header';
import { useSession } from 'next-auth/react';

// Mock useSession pro testování
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: null,
    status: 'unauthenticated'
  }),
  signOut: jest.fn(),
  signIn: jest.fn()
}));

// Mock Image z Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, width, height, className }) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid={`image-${alt}`}
      />
    );
  }
}));

// Mock useParams a další navigační hooky
jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ locale: 'cs' }),
  usePathname: jest.fn().mockReturnValue('/cs'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Mock LanguageSwitcher komponenty
jest.mock('../LanguageSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="language-switcher">Language Switcher</div>
}));

// Mock @heroicons/react/24/outline
jest.mock('@heroicons/react/24/outline', () => ({
  Bars3Icon: () => <div data-testid="bars-icon" />,
  XMarkIcon: () => <div data-testid="xmark-icon" />
}));

// Mock useTranslation hooku
jest.mock('../TranslationProvider', () => ({
  useTranslation: jest.fn().mockReturnValue({
    translate: jest.fn().mockImplementation(key => {
      const translations = {
        'app.title': 'BondFolio',
        'nav.home': 'Domů',
        'nav.listings': 'Nabídky',
        'nav.portfolio': 'Portfolio',
        'nav.about': 'O nás',
        'nav.contact': 'Kontakt',
        'auth.signin': 'Přihlásit se',
        'auth.register': 'Registrovat',
        'nav.dashboard': 'Dashboard',
        'auth.signout': 'Odhlásit se'
      };
      return translations[key] || key;
    }),
    locale: 'cs'
  })
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window object for scroll event
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  it('renders the header with navigation links', () => {
    render(<Header />);

    // Ověření, že hlavička obsahuje logo
    expect(screen.getByAltText('BondFolio Logo')).toBeInTheDocument();

    // Ověření, že hlavička obsahuje navigační odkazy
    expect(screen.getByText('Domů')).toBeInTheDocument();
    expect(screen.getByText('Nabídky')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('O nás')).toBeInTheDocument();
    expect(screen.getByText('Kontakt')).toBeInTheDocument();

    // Ověření, že hlavička obsahuje autentizační odkazy
    expect(screen.getByText('Přihlásit se')).toBeInTheDocument();
    expect(screen.getByText('Registrovat')).toBeInTheDocument();

    // Ověření, že hlavička obsahuje přepínač jazyků
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Header />);

    // Initially, mobile menu should be closed or not expanded
    const mobileMenu = screen.queryByRole('navigation', { hidden: true });
    const menuButton = screen.getByTestId('bars-icon').closest('button');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Click the menu button to open the menu
    fireEvent.click(menuButton);

    // Now menu button should show expanded state
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('changes header style on scroll', () => {
    render(<Header />);

    // Get the scroll event handler
    const scrollHandler = window.addEventListener.mock.calls.find(
      call => call[0] === 'scroll'
    )[1];

    // Initially, header should not have scrolled class
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('backdrop-blur-md');
    expect(header).not.toHaveClass('shadow-md');

    // Simulate scroll event
    window.scrollY = 20;
    act(() => {
      scrollHandler();
    });

    // Now header should have scrolled class
    expect(header).toHaveClass('backdrop-blur-md');
    expect(header).toHaveClass('shadow-md');
  });

  it('renders user menu when user is logged in', () => {
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated'
    });

    render(<Header />);

    // Auth links should not be visible
    expect(screen.queryByText('Přihlásit se')).not.toBeInTheDocument();
    expect(screen.queryByText('Registrovat')).not.toBeInTheDocument();

    // User menu should be visible
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows user profile elements for authenticated users', () => {
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated'
    });

    render(<Header />);

    // User profile elements should be visible
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Odhlásit se')).toBeInTheDocument();
  });

  it('removes scroll event listener on unmount', () => {
    const { unmount } = render(<Header />);

    unmount();

    // Check that removeEventListener was called with 'scroll'
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});