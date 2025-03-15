export const getInitials = string => {
  if (!string) return '' // Return empty string if null or undefined
  return string.split(/\s+/).reduce((response, word) => response + word[0], '')
}
