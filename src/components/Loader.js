import React from "react";
import PropTypes from "prop-types";

import { LinearProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";

import Waiting from "./Waiting";

const styles = theme => ({
  customLoaderRoot: {
    verticalAlign: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "10px 10px"
    },
    [theme.breakpoints.up("sm")]: {
      padding: "60px 10px"
    }
  },
  customLoaderMessage: {
    marginBottom: "10px",
    textAlign: "center"
  },
  progress: {
    width: 50,
    margin: "0px auto"
  }
});

const CustomLoader = ({ message, classes }) => (
  <div className={classes.customLoaderRoot}>
    <div className={classes.customLoaderMessage}>{message}</div>
    <LinearProgress className={classes.progress} />
  </div>
);
CustomLoader.displayName = "WithStyles(CustomLoader)";
CustomLoader.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string
};
CustomLoader.defaultProps = {
  message: "Loading"
};

const Loader = ({ message, classes, ...props }) => (
  <Waiting
    loader={<CustomLoader message={message} classes={classes} />}
    {...props}
  />
);

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired
};
Loader.defaultProps = {
  message: "Loading"
};

export default withStyles(styles)(Loader);