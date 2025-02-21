import HomeView from '@/components/screens/dashboard';

export async function generateMetadata() {
  return {
    title: 'หน้าแดชบอร์ด',
    description: 'A I S T',
  };
}


const Dashboard = () => (

  <HomeView />

);

export default Dashboard;

// import HomeView from '@/components/screens/dashboard';


// const Dashboard = () => (
//   <HomeView />
// );

// export default Dashboard;
