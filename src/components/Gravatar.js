import React from "react";
import PropTypes from "prop-types";
import Avatar from "material-ui/Avatar";

import md5 from "js-md5";

const Gravatar = ({ email, ...props }) => (
  <Avatar src={`https://s.gravatar.com/avatar/${md5(email)}`} {...props} />
);

Gravatar.propTypes = {
  email: PropTypes.string.isRequired
};

export default Gravatar;
