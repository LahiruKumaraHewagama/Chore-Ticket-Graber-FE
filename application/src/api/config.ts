
declare global {
  interface Window {
    configs: {
      apiUrl: string;
    };
  }
}

export const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "http://localhost:4000/api/reservations";
