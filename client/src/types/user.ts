export type User = {
  id: string;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  displayName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: Date;
  city: string;
  country: string;
};
