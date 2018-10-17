import axios from 'axios';
import * as types from './types';

export const savePrinter = printer => dispatch => {
  const promise = printer._id ?
      updatePrinter(printer) : createPrinter(printer);
  return promise
      .then(res => {
        dispatch({
          type: types.PRINTER_SAVE_SUCCESS,
          payload: res.data,
        })
      })
      .catch(err => {
        dispatch({
          type: types.GET_ERRORS,
          payload: err.response.data
        });
      });
};

export const getPrinters = () => dispatch => {
  return axios.get('/api/printers/')
      .then(res => {
        dispatch({
          type: types.PRINTER_GET_SUCCESS,
          payload: res.data,
        })
      })
      .catch(err => {
        dispatch({
          type: types.GET_ERRORS,
          payload: err.response.data
        });
      });
};

export const removePrinter = (id) => dispatch => {
  return axios.delete(`/api/printers/${id}`)
      .then(res => {
        dispatch({
          type: types.PRINTER_DELETE_SUCCESS,
          payload: res.data,
        })
      })
      .catch(err => {
        dispatch({
          type: types.GET_ERRORS,
          payload: err.response.data,
        });
      });
};

export const createPrinter = (printer) => {
  return axios.post('/api/printers/', printer);
};

export const updatePrinter = (printer) => {
  return axios.put(`/api/printers/${printer._id}`, printer);
};