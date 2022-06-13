import ky from "ky";

const useKy = () => {
  return ky.create({
    prefixUrl: import.meta.env.VITE_APP_API_URL,
  });
};

export default useKy;
