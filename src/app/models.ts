export interface Summary {
  montoTotalAPagar: number;
  cupoDisponibleTotal: number;
  cupoTotalGeneral: number;
  proximoPago: any;
}

export interface ResumenNacional {
  montoTotalAPagar: number;
  cupoDisponibleTotal: number;
  cupoTotalGeneral: number;
}

export interface ResumenInternacional {
  montoTotalAPagar: number;
  cupoDisponibleTotal: number;
  cupoTotalGeneral: number;
}

export interface AccountStatement {
  id: number;
  banco: string;
  tarjeta: string;
  urlLogo: string;
  cupoTotal: number;
  fechaEmision: string;
  fechaPago: string;
  montoAPagar: number;
  cupoDisponible: number;
  divisa: string;
  n_tarjeta: string;
}

export interface ApiResponse {
  resumen: Summary;
  resumenNacional?: ResumenNacional;
  resumenInternacional?: ResumenInternacional;
  estadosDeCuenta: AccountStatement[];
}
