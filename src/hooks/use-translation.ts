
import { useProfile } from './use-profile';
import { translations, Language } from '@/lib/translations';

export function useTranslation() {
  const { profile } = useProfile();
  const lang = (profile?.language as Language) || 'fr';
  
  // Return the translations for the current language, 
  // with a fallback to French if something is missing
  const t = translations[lang] || translations.fr;
  
  return { t, lang };
}
