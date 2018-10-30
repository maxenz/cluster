import {
  COLORS_BLACK,
  COLORS_BLUE,
  COLORS_RED,
  COLORS_GREEN,
  MATERIAL_ABS,
  MATERIAL_FLEX,
  MATERIAL_PLA,
  REQUESTS_STATUS_DONE,
  REQUESTS_STATUS_PRINTING,
  REQUESTS_STATUS_QUOTE_REJECTED,
  REQUESTS_STATUS_QUOTED_BY_ADMIN,
  REQUESTS_STATUS_READY_TO_DELIVER,
  REQUESTS_STATUS_READY_TO_PRINT,
  REQUESTS_STATUS_SENT_BY_USER,
  REQUESTS_STATUS_QUOTE_ACCEPTED,
} from "../../constants/requests";

const colorsList = [
  {value: COLORS_BLUE, text: 'AZUL'},
  {value: COLORS_BLACK, text: 'NEGRO'},
  {value: COLORS_RED, text: 'ROJO'},
  {value: COLORS_GREEN, text: 'VERDE'},
];

const materialsList = [
  {value: MATERIAL_ABS, text: 'ABS'},
  {value: MATERIAL_FLEX, text: 'FLEX'},
  {value: MATERIAL_PLA, text: 'PLA'},
];

const requestStatesList = [
  {value: REQUESTS_STATUS_SENT_BY_USER, text: 'ESPERANDO COTIZACION'},
  {value: REQUESTS_STATUS_QUOTED_BY_ADMIN, text: 'COTIZACION ENVIADA'},
  {value: REQUESTS_STATUS_READY_TO_PRINT, text: 'LISTO PARA IMPRIMIR'},
  {value: REQUESTS_STATUS_QUOTE_REJECTED, text: 'COTIZACION RECHAZADA'},
  {value: REQUESTS_STATUS_PRINTING, text: 'IMPRIMIENDO'},
  {value: REQUESTS_STATUS_READY_TO_DELIVER, text: 'LISTO PARA RETIRAR'},
  {value: REQUESTS_STATUS_DONE, text: 'ENTREGADA'},
  {value: REQUESTS_STATUS_QUOTE_ACCEPTED, text: 'COTIZACION ACEPTADA'},
];

const getColorByValue = (color) => {
  switch (color) {
    case COLORS_BLUE:
      return 'background-blue';
    case COLORS_BLACK:
      return 'background-black';
    case COLORS_RED:
      return 'background-red';
    case COLORS_GREEN:
      return 'background-green';
    default:
      return "";
  }
};

export {
  colorsList,
  materialsList,
  requestStatesList,
  getColorByValue,
}