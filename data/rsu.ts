export type RSUGrant = {
  id: string;
  grantDate: string;
  vestDate: string;
  shares: number;
  grantPrice: number;
};

export const rsuGrants: RSUGrant[] = [
  {
    id: "2023",
    grantDate: "2023-01-15",
    vestDate: "2027-01-15",
    shares: 52,
    grantPrice: 261.06,
  },

  {
    id: "2024-A",
    grantDate: "2024-01-15",
    vestDate: "2028-01-15",
    shares: 45,
    grantPrice: 308.54,
  },

  {
    id: "2024-B",
    grantDate: "2024-07-15",
    vestDate: "2028-07-15",
    shares: 330,
    grantPrice: 308.53,
  },

  {
    id: "2025",
    grantDate: "2025-01-15",
    vestDate: "2029-01-15",
    shares: 50,
    grantPrice: 302.36,
  },
];