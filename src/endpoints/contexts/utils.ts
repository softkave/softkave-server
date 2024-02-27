export function getMongoFullTextRegex(text: string) {
  return new RegExp(`^${text}$`, 'i');
}
