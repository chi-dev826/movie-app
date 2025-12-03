import axios from "axios";
import { EXTERNAL_API_URLS } from "../constants/external";

export const eigaComClient = axios.create({
  baseURL: EXTERNAL_API_URLS.EIGA_COM,
});
