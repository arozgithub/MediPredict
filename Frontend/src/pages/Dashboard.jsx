import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import "./dashboard.css";

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

function Dashboard() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [predictionStats, setPredictionStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [healthTrends, setHealthTrends] = useState(null);

  // Fetch user data if not in context
  useEffect(() => {
    if (userInfo?.data) {
      setLoading(false);
    } else {
      fetch("http://localhost:8080/api/v1/users/profile", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserInfo(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    }

    // Fetch prediction statistics
    fetch("http://localhost:8080/api/v1/predict/stats", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPredictionStats(data.data);
        }
      })
      .catch((err) => console.error("Error fetching prediction stats:", err));

    // Fetch recent predictions
    fetch("http://localhost:8080/api/v1/predict/recent", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecentPredictions(data.data || []);
        } else {
          // If API endpoint isn't implemented yet, use sample data
          setRecentPredictions([
            { 
              id: 1, 
              type: "Breast Cancer", 
              result: "Negative", 
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              confidence: "93%" 
            },
            { 
              id: 2, 
              type: "Heart Disease", 
              result: "Low Risk", 
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              confidence: "87%" 
            },
            { 
              id: 3, 
              type: "Diabetes", 
              result: "Negative", 
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              confidence: "91%" 
            }
          ]);
        }
      })
      .catch((err) => console.error("Error fetching recent predictions:", err));

    // Fetch health trends
    fetch("http://localhost:8080/api/v1/predict/trends", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHealthTrends(data.data);
        } else {
          // Sample health trends data if API isn't ready
          setHealthTrends({
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            heartRiskScores: [65, 68, 62, 59, 57, 55],
            diabetesRiskScores: [42, 40, 38, 39, 35, 32],
            totalPredictions: [5, 8, 6, 9, 12, 15]
          });
        }
      })
      .catch((err) => console.error("Error fetching health trends:", err));
  }, []);

  // Chart configurations
  const predictionTypeData = {
    labels: ['Heart Disease', 'Breast Cancer', 'Lung Cancer', 'Diabetes'],
    datasets: [
      {
        label: 'Predictions by Type',
        data: predictionStats?.byType || [12, 8, 5, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const healthTrendsData = {
    labels: healthTrends?.months || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: 'Heart Risk Score',
        data: healthTrends?.heartRiskScores || [65, 68, 62, 59, 57, 55],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Diabetes Risk Score',
        data: healthTrends?.diabetesRiskScores || [42, 40, 38, 39, 35, 32],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const predictionVolumeData = {
    labels: healthTrends?.months || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: 'Predictions Made',
        data: healthTrends?.totalPredictions || [5, 8, 6, 9, 12, 15],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-tab">
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Predictions</h3>
                <div className="metric-value">{predictionStats?.total || 40}</div>
                <div className="metric-label">Since account creation</div>
              </div>
              <div className="metric-card">
                <h3>Last Prediction</h3>
                <div className="metric-value">
                  {recentPredictions[0]?.type || "Heart Disease"}
                </div>
                <div className="metric-label">
                  {recentPredictions[0]?.date ? new Date(recentPredictions[0].date).toLocaleDateString() : "2023-04-25"}
                </div>
              </div>
              <div className="metric-card">
                <h3>Health Score</h3>
                <div className="metric-value">
                  {predictionStats?.healthScore || 85}/100
                </div>
                <div className="metric-label">Based on prediction history</div>
              </div>
              <div className="metric-card">
                <h3>Risk Level</h3>
                <div className="metric-value">
                  {predictionStats?.riskLevel || "Low"}
                </div>
                <div className="metric-label">Aggregated risk assessment</div>
              </div>
            </div>

            <div className="chart-grid">
              <div className="chart-container">
                <h3>Prediction Types</h3>
                <div className="doughnut-container">
                  <Doughnut 
                    data={predictionTypeData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      }
                    }}
                  />
                </div>
              </div>

              <div className="chart-container">
                <h3>Health Trends</h3>
                <Line data={healthTrendsData} options={chartOptions} />
              </div>
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div className="history-tab">
            <div className="prediction-activity">
              <h3>Prediction History</h3>
              
              <div className="prediction-volume-chart">
                <Bar 
                  data={predictionVolumeData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Monthly Prediction Volume',
                      },
                    },
                  }}
                />
              </div>
              
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Test Type</th>
                      <th>Result</th>
                      <th>Confidence</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPredictions.map((prediction) => (
                      <tr key={prediction.id}>
                        <td>{new Date(prediction.date).toLocaleDateString()}</td>
                        <td>{prediction.type}</td>
                        <td className={prediction.result.toLowerCase().includes('negative') || prediction.result.toLowerCase().includes('low') ? 'result-negative' : 'result-positive'}>
                          {prediction.result}
                        </td>
                        <td>{prediction.confidence}</td>
                        <td>
                          <button className="view-report-btn">View Report</button>
                        </td>
                      </tr>
                    ))}
                    {recentPredictions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="no-records">
                          No prediction history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="profile-tab">
            <div className="profile-grid">
              <div className="personal-info">
                <h3>Personal Information</h3>
                <div className="profile-details">
                  <div className="profile-field">
                    <label>Username</label>
                    <div className="field-value">{userInfo?.data?.username || "user123"}</div>
                  </div>
                  <div className="profile-field">
                    <label>Full Name</label>
                    <div className="field-value">{userInfo?.data?.fullname || "John Doe"}</div>
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <div className="field-value">{userInfo?.data?.email || "john.doe@example.com"}</div>
                  </div>
                  <div className="profile-field">
                    <label>Account Created</label>
                    <div className="field-value">
                      {userInfo?.data?.createdAt ? new Date(userInfo.data.createdAt).toLocaleString() : "April 15, 2025"}
                    </div>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="edit-profile-btn">Edit Profile</button>
                  <button className="change-password-btn">Change Password</button>
                </div>
              </div>

              <div className="preferences">
                <h3>Preferences</h3>
                <div className="preference-settings">
                  <div className="preference-item">
                    <label htmlFor="emailNotifications">Email Notifications</label>
                    <input type="checkbox" id="emailNotifications" defaultChecked />
                  </div>
                  <div className="preference-item">
                    <label htmlFor="reportFormat">Report Format</label>
                    <select id="reportFormat" defaultValue="pdf">
                      <option value="pdf">PDF</option>
                      <option value="html">HTML</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  <div className="preference-item">
                    <label htmlFor="dataSharing">Data Sharing for Research</label>
                    <input type="checkbox" id="dataSharing" defaultChecked />
                  </div>
                </div>
                <button className="save-preferences-btn">Save Preferences</button>
              </div>
            </div>
            
            <div className="data-management">
              <h3>Data Management</h3>
              <div className="data-actions">
                <button className="export-data-btn">Export All Data</button>
                <button className="delete-account-btn">Delete Account</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Health Dashboard</h1>
        <p>Track your health metrics and prediction history</p>
      </div>

      <div className="user-welcome">
        <div className="welcome-text">
          <h2>Welcome back, {userInfo?.data?.fullname || "User"}!</h2>
          <p>Last login: {new Date().toLocaleString()}</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn">New Prediction</button>
          <button className="action-btn">View Reports</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Prediction History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile & Settings
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Dashboard;
