export type ServiceType =
  | 'apprenticeship'
  | 'traineeship'
  | 'recruitment'
  | 'technology'
  | 'compliance'
  | 'mentoring'
  | 'future_services';

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: ServiceType;
  message: string;
}
