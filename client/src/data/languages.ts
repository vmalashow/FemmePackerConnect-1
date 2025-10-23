export const LANGUAGES = [
  { name: "English", flag: "🇬🇧" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "German", flag: "🇩🇪" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Portuguese", flag: "🇵🇹" },
  { name: "Mandarin", flag: "🇨🇳" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Korean", flag: "🇰🇷" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Russian", flag: "🇷🇺" },
  { name: "Dutch", flag: "🇳🇱" },
  { name: "Swedish", flag: "🇸🇪" },
  { name: "Norwegian", flag: "🇳🇴" },
  { name: "Danish", flag: "🇩🇰" },
  { name: "Polish", flag: "🇵🇱" },
  { name: "Turkish", flag: "🇹🇷" },
  { name: "Hindi", flag: "🇮🇳" },
  { name: "Greek", flag: "🇬🇷" },
  { name: "Hebrew", flag: "🇮🇱" },
  { name: "Finnish", flag: "🇫🇮" },
  { name: "Czech", flag: "🇨🇿" },
  { name: "Thai", flag: "🇹🇭" },
  { name: "Vietnamese", flag: "🇻🇳" },
  { name: "Indonesian", flag: "🇮🇩" },
  { name: "Malay", flag: "🇲🇾" },
  { name: "Romanian", flag: "🇷🇴" },
  { name: "Hungarian", flag: "🇭🇺" },
  { name: "Ukrainian", flag: "🇺🇦" },
  { name: "Croatian", flag: "🇭🇷" },
];

export function getLanguageFlag(language: string): string {
  const lang = LANGUAGES.find(l => l.name.toLowerCase() === language.toLowerCase());
  return lang?.flag || "🌐";
}
