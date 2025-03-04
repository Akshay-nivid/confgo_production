import Nav5 from '@/pages/events/template/Template-5/Nav5';
import TopMenuSection from '@/pages/events/template/TopMenuSection';
import T6navbar from '@/pages/Micro-site/Templates/Template-6/T6navbar';

const Nav = ({ templateId }: { templateId: number }) => {
    const templates: Record<number, JSX.Element> = {
        1: <TopMenuSection classPrefix={`template${templateId}`} />,
        5: <Nav5 />,
        6: <T6navbar />,
    };

    return templates[templateId] ?? <TopMenuSection classPrefix={`template${templateId}`} />;
};

export default Nav;
