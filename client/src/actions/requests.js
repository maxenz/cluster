import axios from 'axios';
import * as types from './types';

export const saveRequest = request => dispatch => {
  const promise = request._id ?
      updateRequest(request) : createRequest(request);
  return promise
      .then(res => {
        dispatch({
          type: types.REQUEST_SAVE_SUCCESS,
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

export const getRequests = () => dispatch => {
  return axios.get('/api/requests/')
      .then(res => {
        dispatch({
          type: types.REQUEST_GET_SUCCESS,
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

export const removeRequest = (id) => dispatch => {
  return axios.delete(`/api/requests/${id}`)
      .then(res => {
        dispatch({
          type: types.REQUEST_DELETE_SUCCESS,
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

export const createRequest = (request) => {
  return axios.post('/api/requests/', request);
};

export const updateRequest = (request) => {
  return axios.put(`/api/requests/${request._id}`, request);
};