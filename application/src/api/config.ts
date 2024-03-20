
declare global {
  interface Window {
    configs: {
      apiUrl: string;
    };
  }
}

export const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "https://d4562274-bba9-41a5-be84-ebd80a7fac99-dev.e1-us-east-azure.choreoapis.dev/qtnh/hotel-reservations-api/hotel-reservation-api-0e0/v1.0/api/reservations";
