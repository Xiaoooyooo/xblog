import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { connect, ConnectedProps, DefaultRootState } from "react-redux";

import blogsReducer, {
  BlogStore,
  removeBlog,
  fetchBlogById
} from "./BlogsStore";

const rootReducer = combineReducers({
  blogStore: blogsReducer
});

const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  console.log("Update Store");
});

// typing connect
export interface RootState extends DefaultRootState {
  blogStore: BlogStore
}
const mapState = (state: RootState) => ({
  blogStore: state.blogStore
});
const mapDispatch = {
  removeBlog,
  fetchBlogById
};
const connector = connect(mapState, mapDispatch);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export { connector };
export default store;
