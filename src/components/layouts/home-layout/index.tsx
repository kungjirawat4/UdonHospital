import Header from './header';

const HomeLayout = (props: {
  children: React.ReactNode;

}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Header />
      {props.children}

    </div>
  );
};

export { HomeLayout };
