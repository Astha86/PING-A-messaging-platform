export const formatName = (name: string | undefined): string => {
  if (!name) return "";
  return name
    .replace(/[0-9]/g, '')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getInitials = (name: string | undefined): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase();
};
