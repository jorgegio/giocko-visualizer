import { State, store } from "../store/state";

function uiUpdatedHandler(
  state: Readonly<State>,
) {
  console.log("uiUpdate called", state);
}

store.subscribe(uiUpdatedHandler);