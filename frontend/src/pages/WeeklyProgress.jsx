import React from 'react';
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

            </div >
            <div className="chart-label">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>

            </div>
        </div >
    );
};



const WeeklyProgressSection = () => (
    <section className="weekly-progress">
        <h2>Your Weekly Progress</h2>
        <div className="charts-container">
            <ProgressChart
                type="cardio"           //we can change it later to make it as parameter from App file
                percentage={79}
                progress="23.7/30 km"
            />
            <ProgressChart
                type="resistance"
                percentage={65}
                progress="15.2/20 km"
            />
        </div>
    </section>
);

export default WeeklyProgressSection;