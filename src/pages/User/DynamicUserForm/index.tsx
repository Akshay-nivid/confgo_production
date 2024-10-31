import apiClient from "@/Libs/Https/API-client";
import useStore from "@/Libs/store";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";

/**
 * DynamicUserForm component renders a form within a grid layout.
 * This component is intended to be a dynamic form for user input.
 */
const DynamicUserForm = () => {
  const POST = useStore((state) => state.POST);

  useEffect(() => {
    const fetchDynamicFormData = async () => {
      const response = await apiClient.get("event/form/1");
      console.log(response);
    };
  }, []);
  return <Grid>hello</Grid>;
};

export default DynamicUserForm;
