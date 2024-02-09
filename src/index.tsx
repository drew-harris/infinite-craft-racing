/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";

const sidebar = document.getElementsByClassName("sidebar");

// Create div in the sidebar
const root = document.createElement("div");
root.id = "root";

// Append the div to the sidebar
sidebar[0].prepend(root);

// Render the app
render(() => <App />, root!);
