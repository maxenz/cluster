import axios from 'axios';
import * as types from './types';

export const saveRequest = request => (dispatch, getState) => {
  const userId = getState().auth.user.id;
  const promise = request._id ?
      updateRequest(request) : createRequest(request, userId);
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
          payload: err.message,
        });
      });
};

export const getRequests = () => (dispatch, getState) => {
  return axios.get('/api/requests/')
      .then(res => {
        const user = getState().auth.user;
        let requests = res.data.data;
        if (!user.admin) {
          requests = requests.filter(x => x.created_by === user.id);
        }
        dispatch({
          type: types.REQUEST_GET_SUCCESS,
          payload: requests,
        })
      })
      .catch(err => {
        dispatch({
          type: types.GET_ERRORS,
          payload: err.message,
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
          payload: err.message,
        });
      });
};

export const createRequest = (request, userId) => {
  request = {...request, created_by: userId};
  return axios.post('/api/requests/', request);
};

export const updateRequest = (request) => {
  return axios.put(`/api/requests/${request._id}`, request);
};