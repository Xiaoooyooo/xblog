import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";

import blogsReducer, { removeBlog, fetchBlogById } from "./BlogsStore";

const rootReducer = combineReducers({
  blogStore: blogsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  console.log("Update Store");
});

//typing hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// typing connect
const mapState = (state: RootState) => ({
  ...state,
});
const mapDispatch = {
  removeBlog,
  fetchBlogById,
};
const connector = connect(mapState, mapDispatch);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export { connector };
export default store;
