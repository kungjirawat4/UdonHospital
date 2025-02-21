import React from 'react';
import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';

export const TopLoadingBar = ({ isFetching }: { isFetching?: boolean }) => {
  const ref: React.Ref<LoadingBarRef> | undefined = React.useRef(null);

  React.useEffect(() => {
    if (isFetching) {
      ref.current?.staticStart();
    } else {
      ref.current?.complete();
    }
  }, [isFetching]);

  return <div className="justify-center"><LoadingBar color="red" ref={ref} /></div>;
};
