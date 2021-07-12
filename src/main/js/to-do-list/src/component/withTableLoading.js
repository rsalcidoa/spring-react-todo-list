import React from 'react';
import Typography from "@material-ui/core/Typography";

function WithTableLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <Typography color="textPrimary" gutterBottom variant="p" align="center">
        Please wait, fetching the task's list! :D
      </Typography>
    );
  };
}
export default WithTableLoading;