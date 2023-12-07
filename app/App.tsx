import { Provider } from "react-redux";
import Routes from "@/routes";
import store from "@/redux";

import { init } from "@/redux/actions/user";

store.dispatch(init());

export default function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
