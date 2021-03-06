import propTypes from "prop-types";
import React from "react";

export default function MultiInputLine(props) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="columns">
          {props.children.map((c) => {
            return (
              <div className="column" key={c.props.label}>
                {c}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

MultiInputLine.propTypes = {
  label: propTypes.string,
  children: propTypes.array,
};
