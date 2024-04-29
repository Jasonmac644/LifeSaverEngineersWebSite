import { Snackbar, Alert } from "@mui/material";

const AlertBox = ({handler, message, state, type='error'  }) => {


  const handleEdit = () => {
    handler(!state);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={state}
      onClose={() => handleEdit(false)}
      autoHideDuration={2000}
    >
      <Alert
        onClose={() => handleEdit(false)}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};


export default AlertBox;