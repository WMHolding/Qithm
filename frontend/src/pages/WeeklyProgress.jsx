import React, { useState } from 'react';
import "../styles/WeeklyProgress.css";

const ProgressChart = ({ type, percentage, progress }) => {
    const colors = {
        cardio: '#4CAF50',
        resistance: '#4CAF50'
    };
    const c = 70;
    const r = c - 10;

    return (
        <div className="progress-chart">
            <div className="chart-container">
                <svg width={c * 2} height={c * 2}>
                    <circle
                        cx={c}
                        cy={c}
                        r={r}
                        fill="none"
                        stroke={colors[type]}
                        strokeWidth="13"
                        strokeDasharray={`${2 * Math.PI * r}`}
                        strokeDashoffset={2 * Math.PI * r * (1 - percentage / 100)}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${c} ${c})`}
                    />
                    <text
                        x="50%"
                        y="45%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="percentage"
                    >
                        {percentage}%
                    </text>
                    <text
                        x="50%"
                        y="60%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="progress-text"
                    >
                        {progress}
                    </text>
                </svg>
            </div>
            <div className="chart-label">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            </div>
        </div>
    );
};

const WeeklyProgressSection = () => {
    const [showModal, setShowModal] = useState(false);
    const [cardioValue, setCardioValue] = useState('');
    const [resistanceValue, setResistanceValue] = useState('');
    const [progressData, setProgressData] = useState({
        cardio: {
            current: 23.7,
            goal: 30,
            percentage: 79
        },
        resistance: {
            current: 15.2,
            goal: 20,
            percentage: 65
        }
    });

    const handleAddProgress = () => {
        const newCardioValue = progressData.cardio.current + Number(cardioValue);
        const newResistanceValue = progressData.resistance.current + Number(resistanceValue);

        // Calculate new percentages
        const newCardioPercentage = Math.min(Math.round((newCardioValue / progressData.cardio.goal) * 100), 100);
        const newResistancePercentage = Math.min(Math.round((newResistanceValue / progressData.resistance.goal) * 100), 100);

        setProgressData({
            cardio: {
                current: Number(newCardioValue.toFixed(1)),
                goal: progressData.cardio.goal,
                percentage: newCardioPercentage
            },
            resistance: {
                current: Number(newResistanceValue.toFixed(1)),
                goal: progressData.resistance.goal,
                percentage: newResistancePercentage
            }
        });

        // Reset form and close modal
        setCardioValue('');
        setResistanceValue('');
        setShowModal(false);
    };

    return (
        <section className="weekly-progress">
            <h2>Your Weekly Progress</h2>
            <div className="charts-container">
                <ProgressChart
                    type="cardio"
                    percentage={progressData.cardio.percentage}
                    progress={`${progressData.cardio.current}/${progressData.cardio.goal} km`}
                />
                <ProgressChart
                    type="resistance"
                    percentage={progressData.resistance.percentage}
                    progress={`${progressData.resistance.current}/${progressData.resistance.goal} km`}
                />
                <button
                    className="add-daily-progress-button"
                    onClick={() => setShowModal(true)}
                >
                    Add Daily Progress
                </button>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Daily Progress</h3>
                        <div className="input-group">
                            <label htmlFor="cardio">Cardio (m)</label>
                            <input
                                type="number"
                                id="cardio"
                                value={cardioValue}
                                onChange={(e) => setCardioValue(e.target.value)}
                                placeholder="Enter cardio progress"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="resistance">Resistance (min)</label>
                            <input
                                type="number"
                                id="resistance"
                                value={resistanceValue}
                                onChange={(e) => setResistanceValue(e.target.value)}
                                placeholder="Enter resistance progress"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="add-button" onClick={handleAddProgress}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default WeeklyProgressSection;