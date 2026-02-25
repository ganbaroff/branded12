import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

type LoadingSpinnerProps = {
  fullScreen?: boolean;
  message?: string;
};

export default function LoadingSpinner({ fullScreen = true, message }: LoadingSpinnerProps) {
  const { language } = useLanguage();

  const defaultMessage = {
    az: 'Yüklənir...',
    ru: 'Загрузка...',
    en: 'Loading...'
  }[language];

  const content = (
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-[#FF4D00] animate-spin mx-auto" />
      <p className="text-white/60 mt-4">
        {message || defaultMessage}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
