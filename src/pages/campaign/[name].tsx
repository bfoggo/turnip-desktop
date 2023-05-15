import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';

const CampaignPage = () => {
    const router = useRouter();
    const { name } = router.query;

    return (
        <div>
            <h1>Campaign: {name}</h1>
            <div>
                <h2>Characters</h2>
                <ul>
                </ul>
            </div>
        </div>
    );
};

export default CampaignPage;