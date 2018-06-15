import md5 from 'md5';

export const getGravatarUrl = email => {
  const emailHash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${emailHash}?d=mm&s=200`;
};
