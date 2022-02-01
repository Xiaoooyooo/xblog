/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import { useParams, Params } from "react-router-dom";

export interface WithRouterProps<T extends {} = {}> {
  params: Readonly<Params<Extract<keyof T, string>>>
  // params: ReturnType<typeof useParams>
}

const withRouter = function <P extends WithRouterProps = WithRouterProps>(
  Component: React.ComponentType<P>
) {
  const Wrapper = (props: Omit<P, keyof WithRouterProps>) => {
    const params = useParams();

    return (
      <Component
        {...(props as P)}
        params={params}
      />
    );
  };

  return Wrapper;
};

export default withRouter;
