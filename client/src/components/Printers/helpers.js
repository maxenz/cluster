import {
  PRINTER_STATUS_ENABLED,
  PRINTER_STATUS_DISABLED,
  PRINTER_STATUS_WORKING
} from "../../constants/printers";

const printersList = [
  {value: PRINTER_STATUS_ENABLED, text: 'HABILITADA'},
  {value: PRINTER_STATUS_DISABLED, text: 'DESHABILITADA'},
  {value: PRINTER_STATUS_WORKING, text: 'TRABAJANDO'}
];

const getPrinterStatusByValue = (status) => {
  switch (status) {
    case PRINTER_STATUS_ENABLED:
      return {label: 'HABILITADA', className: 'positive'};
    case PRINTER_STATUS_DISABLED:
      return {label: 'DESHABILITADA', className: 'negative'};
    case PRINTER_STATUS_WORKING:
      return {label: 'TRABAJANDO', className: 'warning'};
    default:
      return "";
  }
};

export {
  printersList,
  getPrinterStatusByValue,
};