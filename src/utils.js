import { encodeObject, decodeObject } from "use-query-params";
import Qty from "js-quantities";
import { useRef } from "react";
import isEqual from "lodash/isEqual";

export const QtyTranscoderMiddleware = (store) => (next) => (action) => {
  if (!action.payload) return next(action);

  const newAction = {
    ...action,
    payload: Object.fromEntries(
      Object.entries(action.payload).map(([k, v]) => {
        return [k, v instanceof Qty ? QtyToDict(v) : v];
      })
    ),
  };

  let result = next(newAction);
  const newResult = {
    ...result,
    payload: Object.fromEntries(
      Object.entries(result).map(([k, v]) => {
        if (v.hasOwnProperty("unit") && v.hasOwnProperty("magnitude")) {
          return [k, DictToQty(v)];
        } else {
          return [k, v];
        }
      })
    ),
  };

  return newResult;
};

export function QtyToDict(qty, unit = null) {
  return unit === null
    ? {
        magnitude: qty.scalar,
        unit: qty._units,
      }
    : {
        magnitude: qty.to(unit).scalar,
        unit: unit,
      };
}

export function DictToQty(d) {
  return Qty(d.magnitude, d.unit);
}

export const QtyParam = {
  encode: (value) => {
    return encodeObject(QtyToDict(value));
  },
  decode: (stringValue) => {
    if (stringValue === undefined) return stringValue;

    const obj = decodeObject(stringValue);
    return Qty(Number(obj.magnitude), obj.unit);
  },
};

export function MakeQty(e, oldQty, unit = null) {
  return Qty(Number(e.target.value), unit === null ? oldQty._units : unit);
}

export const useDeepCompare = (value) => {
  const ref = useRef();
  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
};

export function isLocalhost() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}
