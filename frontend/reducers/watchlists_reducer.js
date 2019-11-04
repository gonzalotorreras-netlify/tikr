import { merge } from "lodash";
import {
  RECEIVE_ALL_WATCHLIST_ITEMS,
  RECEIVE_WATCHLIST_ITEM,
  REMOVE_WATCHLIST_ITEM
} from "../actions/watchlist_actions";
import {
    REMOVE_USER
} from "../actions/session_actions";

const watchlistsReducer = (state = {}, action) => {
    // debugger
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_ALL_WATCHLIST_ITEMS:
      return merge({}, state, action.watchlist);
    case RECEIVE_WATCHLIST_ITEM:
        debugger
      return merge({}, state, action.item);
    case REMOVE_WATCHLIST_ITEM:
      newState = merge({}, state);
      debugger
      let watchlistItem = Object.keys(action.item)[0];
      delete newState[watchlistItem]
      debugger
      return newState;
    case REMOVE_USER:
      return {};

    default:
      return state;
  }
};

export default watchlistsReducer;
