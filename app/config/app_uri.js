import Constants from "expo-constants";
const { manifest } = Constants;

export const uri = `http://${manifest.debuggerHost
    .split(`:`)
    .shift()
    .concat(`:3000`)}`;

// export const uri = "https://dibida.herokuapp.com";
