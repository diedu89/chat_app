import Cookies from "js-cookie";

export const handleUnauthorized = (status: number) => {
  if (status === 401) {
    Cookies.remove("auth");
    window.location.reload();
  }
};
