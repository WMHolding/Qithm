import React, { useState } from 'react';
import '../styles/AdminDashboard.css';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for members
    const [members, setMembers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'member', joinDate: '2023-09-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'trainer', joinDate: '2023-08-22' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'member', joinDate: '2023-10-05' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'member', joinDate: '2023-11-12' },
        { id: 5, name: 'Alex Brown', email: 'alex@example.com', role: 'trainer', joinDate: '2023-07-30' }
    ]);

    // Mock data for challenges
    const [challenges, setChallenges] = useState([
        { id: 1, title: '10K Steps Daily', category: 'cardio', participants: 120, duration: '30 days', status: 'active' },
        { id: 2, title: 'Weekly Yoga Challenge', category: 'flexibility', participants: 85, duration: '7 days', status: 'active' },
        { id: 3, title: 'Muscle Marathon', category: 'strength', participants: 65, duration: '14 days', status: 'inactive' },
        { id: 4, title: 'Summer Shred', category: 'weightloss', participants: 150, duration: '60 days', status: 'scheduled' }
    ]);

    // Filter members based on search query
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter challenges based on search query
    const filteredChallenges = challenges.filter(challenge =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle role change for members
    const handleRoleChange = (memberId, newRole) => {
        setMembers(members.map(member =>
            member.id === memberId ? { ...member, role: newRole } : member
        ));
    };

    // Handle member removal
    const handleRemoveMember = (memberId) => {
        setMembers(members.filter(member => member.id !== memberId));
    };

    // Handle challenge status change
    const handleChallengeStatusChange = (challengeId, newStatus) => {
        setChallenges(challenges.map(challenge =>
            challenge.id === challengeId ? { ...challenge, status: newStatus } : challenge
        ));
    };

    // Handle challenge removal
    const handleRemoveChallenge = (challengeId) => {
        setChallenges(challenges.filter(challenge => challenge.id !== challengeId));
    };

    // Modal state for adding new challenge
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        category: '',
        duration: '',
        status: 'scheduled'
    });

    // Handle adding new challenge
    const handleAddChallenge = () => {
        setChallenges([...challenges, {
            id: challenges.length + 1,
            ...newChallenge,
            participants: 0
        }]);
        setShowChallengeModal(false);
        setNewChallenge({
            title: '',
            category: '',
            duration: '',
            status: 'scheduled'
        });
    };

    // Website content state
    const [websiteContent, setWebsiteContent] = useState({
        welcomeMessage: 'Welcome to FitConnect - Your Fitness Community!',
        aboutUs: 'FitConnect is a platform where fitness enthusiasts can connect, challenge each other, and achieve their goals together.',
        missionStatement: 'Our mission is to build a supportive community that helps everyone maintain consistency in their fitness journey.'
    });

    // Modal state for editing website content
    const [showContentModal, setShowContentModal] = useState(false);
    const [editingContent, setEditingContent] = useState({ ...websiteContent });

    // Handle saving website content
    const handleSaveContent = () => {
        setWebsiteContent({ ...editingContent });
        setShowContentModal(false);
    };

    // Reports data
    const reportData = {
        activeUsers: 875,
        activeTrainers: 42,
        activeChallenges: 12,
        completedChallenges: 24,
        userGrowth: '+15%',
        trainerGrowth: '+8%',
        mostActiveChallenge: '10K Steps Daily',
        averageCompletionRate: '68%'
    };

    return (
        <div className="admin-dashboard-container">
            {/* Left Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-profile">
                    <div className="admin-avatar">
                        <span>A</span>
                    </div>
                    <h3>Admin Panel</h3>
                </div>
                <div className="admin-nav">
                    <button
                        className={`admin-nav-btn ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        Manage Members
                    </button>
                    <button
                        className={`admin-nav-btn ${activeTab === 'challenges' ? 'active' : ''}`}
                        onClick={() => setActiveTab('challenges')}
                    >
                        Manage Challenges
                    </button>
                    <button
                        className={`admin-nav-btn ${activeTab === 'content' ? 'active' : ''}`}
                        onClick={() => setActiveTab('content')}
                    >
                        Website Content
                    </button>
                    <button
                        className={`admin-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                </div>
            </div>

            {/* Right Content */}
            <div className="admin-content">
                <div className="admin-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    <div className="admin-search">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="admin-section">
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Join Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.name}</td>
                                            <td>{member.email}</td>
                                            <td>
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="trainer">Trainer</option>
                                                </select>
                                            </td>
                                            <td>{member.joinDate}</td>
                                            <td>
                                                <button
                                                    className="admin-remove-btn"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Challenges Tab */}
                {activeTab === 'challenges' && (
                    <div className="admin-section">
                        <button
                            className="admin-add-btn"
                            onClick={() => setShowChallengeModal(true)}
                        >
                            Add New Challenge
                        </button>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Participants</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredChallenges.map((challenge) => (
                                        <tr key={challenge.id}>
                                            <td>{challenge.title}</td>
                                            <td>{challenge.category}</td>
                                            <td>{challenge.participants}</td>
                                            <td>{challenge.duration}</td>
                                            <td>
                                                <select
                                                    value={challenge.status}
                                                    onChange={(e) => handleChallengeStatusChange(challenge.id, e.target.value)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="scheduled">Scheduled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-remove-btn"
                                                    onClick={() => handleRemoveChallenge(challenge.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="admin-section">
                        <button
                            className="admin-edit-btn"
                            onClick={() => {
                                setEditingContent({ ...websiteContent });
                                setShowContentModal(true);
                            }}
                        >
                            Edit Content
                        </button>
                        <div className="content-preview">
                            <div className="content-item">
                                <h3>Welcome Message</h3>
                                <p>{websiteContent.welcomeMessage}</p>
                            </div>
                            <div className="content-item">
                                <h3>About Us</h3>
                                <p>{websiteContent.aboutUs}</p>
                            </div>
                            <div className="content-item">
                                <h3>Mission Statement</h3>
                                <p>{websiteContent.missionStatement}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="admin-section">
                        <div className="reports-grid">
                            <div className="report-card">
                                <h3>Active Users</h3>
                                <p className="report-value">{reportData.activeUsers}</p>
                                <p className="report-growth">{reportData.userGrowth} monthly</p>
                            </div>
                            <div className="report-card">
                                <h3>Active Trainers</h3>
                                <p className="report-value">{reportData.activeTrainers}</p>
                                <p className="report-growth">{reportData.trainerGrowth} monthly</p>
                            </div>
                            <div className="report-card">
                                <h3>Active Challenges</h3>
                                <p className="report-value">{reportData.activeChallenges}</p>
                            </div>
                            <div className="report-card">
                                <h3>Completed Challenges</h3>
                                <p className="report-value">{reportData.completedChallenges}</p>
                            </div>
                            <div className="report-card wide">
                                <h3>Most Active Challenge</h3>
                                <p className="report-value">{reportData.mostActiveChallenge}</p>
                            </div>
                            <div className="report-card wide">
                                <h3>Average Challenge Completion Rate</h3>
                                <p className="report-value">{reportData.averageCompletionRate}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* New Challenge Modal */}
            {showChallengeModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Challenge</h3>
                        <div className="input-group">
                            <label htmlFor="title">Challenge Title</label>
                            <input
                                type="text"
                                id="title"
                                value={newChallenge.title}
                                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                placeholder="Enter challenge title"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                value={newChallenge.category}
                                onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                                placeholder="Enter category"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="duration">Duration</label>
                            <input
                                type="text"
                                id="duration"
                                value={newChallenge.duration}
                                onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
                                placeholder="Enter duration (e.g., 30 days)"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={newChallenge.status}
                                onChange={(e) => setNewChallenge({ ...newChallenge, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setShowChallengeModal(false)}>Cancel</button>
                            <button className="add-button" onClick={handleAddChallenge}>Add Challenge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Content Modal */}
            {showContentModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Website Content</h3>
                        <div className="input-group">
                            <label htmlFor="welcomeMessage">Welcome Message</label>
                            <textarea
                                id="welcomeMessage"
                                value={editingContent.welcomeMessage}
                                onChange={(e) => setEditingContent({ ...editingContent, welcomeMessage: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="aboutUs">About Us</label>
                            <textarea
                                id="aboutUs"
                                value={editingContent.aboutUs}
                                onChange={(e) => setEditingContent({ ...editingContent, aboutUs: e.target.value })}
                                rows="5"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="missionStatement">Mission Statement</label>
                            <textarea
                                id="missionStatement"
                                value={editingContent.missionStatement}
                                onChange={(e) => setEditingContent({ ...editingContent, missionStatement: e.target.value })}
                                rows="4"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setShowContentModal(false)}>Cancel</button>
                            <button className="add-button" onClick={handleSaveContent}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;