/**
 * Catálogo de componentes que se asignan a los ítems del menú.
 * displayName conserva el nombre legible del componente aunque la
 * compilación de producción acorte los nombres de las funciones.
 * Estudiante: Salvador Rodriguez Velasco
 */
import HomePage from './HomePage.jsx';
import SectionPage from './SectionPage.jsx';
import { ProfilePage, MessagesPage, AccountPage, PublicProfilePage } from './ProfilePages.jsx';
import { TwoFactorPage, SessionsPage, PasswordPage, NotificationsPage } from './SettingsPages.jsx';
import { FaqPage, TicketPage, NetworkStatusPage, LogoutPage } from './HelpPages.jsx';

const pages = {
  HomePage,
  SectionPage,
  ProfilePage,
  MessagesPage,
  AccountPage,
  PublicProfilePage,
  TwoFactorPage,
  SessionsPage,
  PasswordPage,
  NotificationsPage,
  FaqPage,
  TicketPage,
  NetworkStatusPage,
  LogoutPage,
};

Object.entries(pages).forEach(([name, component]) => {
  component.displayName = name;
});

export {
  HomePage,
  SectionPage,
  ProfilePage,
  MessagesPage,
  AccountPage,
  PublicProfilePage,
  TwoFactorPage,
  SessionsPage,
  PasswordPage,
  NotificationsPage,
  FaqPage,
  TicketPage,
  NetworkStatusPage,
  LogoutPage,
};
