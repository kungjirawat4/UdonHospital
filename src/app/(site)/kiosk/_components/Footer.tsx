

import Marquee from 'react-fast-marquee';

import useApi from '@/hooks/useApi';

const Footer: React.FC = () => {
  const getMsgApi = useApi({
    key: ['config'],
    method: 'GET',
    url: `medicine/configures`,
  })?.get;
  return (
    <footer className="fixed inset-x-0 bottom-0 h-8 bg-pink-500 text-center text-2xl text-white">
      <Marquee direction="left" autoFill={false} speed={50}>
        {getMsgApi?.data?.data[0].hospital_message || ''}

      </Marquee>
    </footer>
  );
};

export default Footer;
