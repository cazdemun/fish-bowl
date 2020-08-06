import React from "react";

export const Row = ({ className = "", children }) => {
  const centerX = className.match(/center-x/g) ? " justify-center " : "";
  const centerY = className.match(/center-y/g) ? " items-center " : "";
  return (
    <div className={"flex " + centerX + centerY + className}>{children}</div>
  );
};

export const Column = ({ className = "", children }) => {
  const centerX = className.match(/center-x/g) ? " items-center " : "";
  const centerY = className.match(/center-y/g) ? " justify-center " : "";
  return (
    <div className={"flex flex-col " + centerX + centerY + className}>
      {children}
    </div>
  );
};
