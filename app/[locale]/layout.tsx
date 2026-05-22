import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TsaraFIDY',
  description: 'Recruitment Optimization Platform',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      {children}
    </>
  );
}
