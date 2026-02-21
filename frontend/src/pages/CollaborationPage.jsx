import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import CommentsUI from '../components/collaboration/CommentsUI';
import FileUpload from '../components/collaboration/FileUpload';
import DiscussionThreads from '../components/collaboration/DiscussionThreads';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import './CollaborationPage.css';

const CollaborationPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('discussions');

    const tabs = [
        { id: 'discussions', label: 'Discussions', icon: '💬' },
        { id: 'comments', label: 'Comments', icon: '📝' },
        { id: 'files', label: 'Files', icon: '📁' },
    ];

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1><HiOutlineChatAlt2 style={{ verticalAlign: 'middle' }} /> Collaboration</h1>
                        <p>Team discussions, comments, and shared files</p>
                    </div>

                    <div className="analytics-tabs" style={{ marginBottom: 20 }}>
                        {tabs.map(tab => (
                            <button key={tab.id}
                                className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}>
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="animate-fadeIn" key={activeTab}>
                        {activeTab === 'discussions' && <DiscussionThreads />}
                        {activeTab === 'comments' && <CommentsUI />}
                        {activeTab === 'files' && <FileUpload />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollaborationPage;
