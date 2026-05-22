import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is valid
  let validLocale: any = locale;
  if (!locales.includes(locale as any)) {
    validLocale = defaultLocale;
  }

  try {
    return {
      locale: validLocale,
      messages: (await import(`./messages/${validLocale}.json`)).default
    };
  } catch (error) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }
});
