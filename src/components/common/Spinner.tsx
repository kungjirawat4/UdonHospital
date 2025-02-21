'use client';

import LoadingIcons from 'react-loading-icons';

type Props = {
  height?: string;
  stroke?: string;
};

const Spinner = (props: Props) => {
  const { height = '3em', stroke = '#06bcee' } = props;
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <LoadingIcons.ThreeDots
          stroke={stroke}
          height={height}
          fill="transparent"
        />
        <p style={{ color: '#06bcee' }}>Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
