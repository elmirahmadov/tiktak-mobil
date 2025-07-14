export const formatPhoneNumber = (value: string) => {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.startsWith('994')) cleaned = cleaned.slice(3);
  if (cleaned.length > 9) cleaned = cleaned.slice(0, 9);

  let formatted = '(+994) ';
  if (cleaned.length > 0) formatted += cleaned.slice(0, 2);
  if (cleaned.length > 2) formatted += ' ' + cleaned.slice(2, 5);
  if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 7);
  if (cleaned.length > 7) formatted += ' ' + cleaned.slice(7, 9);

  return formatted.trim();
};

export const cleanPhoneNumber = (value: string) => value.replace(/[^\d+]/g, '');
