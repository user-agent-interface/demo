import { component, schema } from '@uai/client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

type Language = 'en' | 'de' | 'es';
const languages: Record<
  Language,
  { name: string; flag: string; changeText: string }
> = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    changeText: 'Change the language to English',
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    changeText: 'Sprache auf Deutsch ändern',
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    changeText: 'Cambiar el idioma a Español',
  },
};
const languagesArray = Object.keys(languages) as Language[];

export const changeLanguage = component({
  description: 'Change the language of the UI',
  inputSchema: schema.object({
    preferredLanguage: schema.enum(languagesArray).optional(),
  }),
  outputSchema: schema.object({
    selectedLanguage: schema.enum(languagesArray),
  }),
  component: function ChangeLanguage({
    preferredLanguage,
    sendComponentOutput,
  }) {
    const [selected, setSelected] = useState<Language>(
      preferredLanguage || 'en'
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
      sendComponentOutput({ selectedLanguage: selected });
    };

    const handleCancel = () => {
      console.log('canceled');
    };

    return (
      <div className="mt-3 rounded-xl border border-border/50 bg-card/50 p-4">
        {/* Custom select dropdown */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-lg leading-none">
                {languages[selected].flag}
              </span>
              <span>{languages[selected].name}</span>
            </span>
            <svg
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
              <div className="max-h-48 overflow-y-auto">
                {languagesArray.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelected(language);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-primary/10 ${
                      selected === language
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    <span className="text-lg leading-none">
                      {languages[language].flag}
                    </span>
                    <span>{languages[language].name}</span>
                    {selected === language && (
                      <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5" />
            {languages[selected].changeText}
          </button>
        </div>
      </div>
    );
  },
});
