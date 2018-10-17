import * as types from '../actions/types';
import {arrayToObject} from "../helpers/arrays";

const initialState = {
  all: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_SAVE_SUCCESS:
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.data._id]: {
            ...action.payload.data,
          }
        },
      };
    case types.REQUEST_GET_SUCCESS:
      return {
        ...state,
        all: arrayToObject(action.payload.data, '_id'),
      };
    case types.REQUEST_DELETE_SUCCESS:
      let key = action.payload.data._id;
      let {[key]:deleted, ...withoutDeleted} = state.all;
      return {
        ...state,
        all: withoutDeleted,
      };
    default:
      return state;
  }
}