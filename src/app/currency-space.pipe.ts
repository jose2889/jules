import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySpace',
  standalone: true
})
export class CurrencySpacePipe implements PipeTransform {
  transform(value: number | null | undefined, currencyCode: string = 'CLP', display?: string, digitsInfo: string = '1.0-0', locale: string = 'es-CL'): string | null {
    if (value == null || isNaN(value)) {
      return null;
    }

    // Extraer información de decimales del formato digitsInfo (ej: '1.0-0' -> 0 decimales)
    const decimalMatch = digitsInfo.match(/\.(\d+)-(\d+)/);
    const minFractionDigits = decimalMatch ? parseInt(decimalMatch[1], 10) : 0;
    const maxFractionDigits = decimalMatch ? parseInt(decimalMatch[2], 10) : 0;

    // Formatear el número usando la API nativa de JavaScript
    // Esto evita problemas de inyección de dependencias
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
      useGrouping: true
    });

    const formattedNumber = formatter.format(value);
    
    // Agregar el código de moneda con espacio antes del número
    const code = currencyCode.toUpperCase();
    
    return `${code} ${formattedNumber}`;
  }
}

