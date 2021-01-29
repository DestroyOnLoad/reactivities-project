import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";

axios.defaults.baseURL = "https://localhost:5001/api";

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response)
    return toast.error("Network connectivity error");
  const { status, data, config } = error.response;
  if (status === 404) return history.push("/notfound");

  if (
    status === 400 &&
    data.errors.hasOwnProperty("id") &&
    config.method === "get"
  )
    return history.push("/notfound");
  if (status === 500)
    return toast.error("Server Error - check the terminal for more info!");
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody),
};

export const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post(`/activities`, activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
};
