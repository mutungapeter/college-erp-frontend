import { toast } from "react-toastify";

  export const handleApiError = (error: unknown, action: string) => {
    console.log("error", error);
    if (error && typeof error === "object" && "data" in error && error.data) {
      const errorData = (error as { data: { error: string } }).data;
      toast.error(errorData.error || `Error ${action}`);
    } else {
      toast.error("Unexpected error occurred. Please try again.");
    }
  };

export const handleApiResponseError=(error?:unknown)=>{
  console.log("error", error);
    if (error && typeof error === "object" && "data" in error && error.data) {
      const errorData = (error as { data: { error: string } }).data;
      return (errorData.error);
    } else {
      return("Unexpected error occurred. Please try again.");
    }
}