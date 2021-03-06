import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Downshift from "downshift";
import { compose } from "recompose";

import animatedScrollTo from "animated-scrollto";

import Loader from "./Loader";
import { withWindowInfos } from "./WindowInfos";
import { debounce } from "../utils/helpers";

const styles = theme => ({
  rootWrapper: {
    position: "relative",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      width: "90vw"
    },
    [theme.breakpoints.up("sm")]: {
      width: "80vw"
    },
    [theme.breakpoints.up("md")]: {
      width: "60vw"
    },
    margin: "0 auto"
  },
  input: {
    width: "100%",
    backgroundColor: "#ececec",
    border: 0,
    padding: 16,
    fontSize: "1.1rem",
    fontWeight: 500,
    fontFamily: `"Roboto", "Arial", sans-serif`,
    borderRadius: 5,
    outline: "none"
  },
  itemsWrapper: {
    padding: 0,
    margin: 0,
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    border: "1px solid rgba(34,36,38,.15)",
    overflowY: "scroll",
    [theme.breakpoints.down("sm")]: {
      maxHeight: 200
    },
    [theme.breakpoints.up("sm")]: {
      maxHeight: 450
    },
    "& li:last-child": {
      border: 0
    }
  },
  item: {
    padding: "8px 16px",
    borderBottom: "1px solid #ececec"
  },
  safeItem: {
    maxWidth: "80%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  itemName: {},
  itemDescription: {},
  itemVersion: {
    textAlign: "right",
    marginTop: -24
  },
  // following are the classes to override the CustomLoader
  customLoaderMessage: {
    display: "none"
  },
  customLoaderRoot: {
    verticalAlign: "center",
    padding: "O auto"
  },
  progress: {
    width: 50,
    margin: "-10px auto 10px"
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], inputValue: "" };
    this.inputEl = null;
  }
  debouncedSearch = debounce(
    value =>
      this.props
        .fetchInfos(value)
        .then(items => {
          this.setState({ items, state: "loaded" });
        })
        .catch(e => {
          console.error(e);
          this.setState({
            items: [],
            state: "error"
          });
        }),
    300
  );
  render() {
    const { goToPackage, windowInfos, classes, theme } = this.props;
    const { inputValue, items, state } = this.state;
    return (
      <Downshift
        itemToString={item => (item && item.name) || ""}
        onChange={item => {
          this.setState({
            inputValue: "" // reset the value of the controlled input
          });
          if (this.inputEl) {
            this.inputEl.blur();
          }
          goToPackage(item.name);
        }}
        render={({
          selectedItem,
          getInputProps,
          getItemProps,
          highlightedIndex,
          isOpen
        }) => (
          <div className={classes.rootWrapper}>
            <input
              data-testid="search-input"
              ref={node => {
                this.inputEl = node;
              }}
              className={classes.input}
              {...getInputProps({
                value: inputValue,
                placeholder: "Search packages",
                onChange: event => {
                  const value = event.target.value;
                  this.setState(
                    {
                      inputValue: value, // keep track of the value of the input
                      state: "loading"
                    },
                    () => this.debouncedSearch(value)
                  );
                },
                onFocus: () => {
                  // on mobile, the keyboard will pop up. Give it some space
                  if (windowInfos.windowWidth < theme.breakpoints.values.sm) {
                    setTimeout(() => {
                      animatedScrollTo(document.body, 75, 400);
                    }, 75);
                  }
                }
              })}
            />
            {["loading", "error"].includes(state) && (
              <ul className={classes.itemsWrapper}>
                <li
                  data-testid="search-loading-indicator"
                  className={classes.item}
                  style={{
                    backgroundColor: "white"
                  }}
                >
                  {state === "loading" ? (
                    <Loader
                      message=""
                      overrideClasses={{
                        customLoaderMessage: classes.customLoaderMessage,
                        customLoaderRoot: classes.customLoaderRoot,
                        progress: classes.progress
                      }}
                    />
                  ) : (
                    "error"
                  )}
                </li>
              </ul>
            )}
            {isOpen &&
              state === "loaded" &&
              items &&
              items.length > 0 && (
                <ul className={classes.itemsWrapper}>
                  {items.map((item, index) => (
                    <li
                      data-testid={`search-result-${index}`}
                      key={item.name}
                      className={classes.item}
                      {...getItemProps({
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? "#ececec" : "white",
                          fontWeight: selectedItem === item ? "bold" : "normal"
                        }
                      })}
                    >
                      <Typography
                        variant="subheading"
                        className={`${classes.itemName} ${classes.safeItem}`}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        className={`${classes.itemDescription} ${
                          classes.safeItem
                        }`}
                      >
                        {item.description}
                      </Typography>
                      <Typography className={classes.itemVersion}>
                        {item.version}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}
      />
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  fetchInfos: PropTypes.func.isRequired,
  goToPackage: PropTypes.func.isRequired,
  windowInfos: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWindowInfos()
)(Search);
