export type Lead = {
  id: string;
  company: string;
  contactName: string;
  title: string;
  phone: string;
  email?: string;
  industry: string;
  employeeCount?: number;
  score: "hot" | "warm" | "cold";
};
