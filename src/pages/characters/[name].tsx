import { useRouter } from 'next/router';

const CampaignPage = () => {
  const router = useRouter();
  const { name } = router.query; 

  return (
    <div>
      <h1>Campaign: {name}</h1>
    </div>
  );
};

export default CampaignPage;