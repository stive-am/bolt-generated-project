document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Store dark mode preference in local storage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Load dark mode preference from local storage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Chart variables
    let codingTrendsChart, languageBreakdownChart;

    // Load initial data and initialize charts
    loadData();
    initializeCharts();

    // Log Form Submission
    const logForm = document.getElementById('logForm');
    if (logForm) {
        logForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            const time = parseFloat(document.getElementById('time').value);
            const language = document.getElementById('language').value;
            const topic = document.getElementById('topic').value;
            const notes = document.getElementById('notes').value;

            addLog(date, time, language, topic, notes);
            logForm.reset();
        });
    }

    // Goal Form Submission
    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
        goalForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const goalType = document.getElementById('goalType').value;
            const targetHours = parseFloat(document.getElementById('targetHours').value);

            setGoal(goalType, targetHours);
            goalForm.reset();
        });
    }

    // Function to load data from local storage
    function loadData() {
        const logs = JSON.parse(localStorage.getItem('logs') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');

        displayLogs(logs);
        displayGoals(goals);
        updateDashboard(logs);
    }

    // Function to display logs
    function displayLogs(logs) {
        const logList = document.getElementById('logList');
        if (logList) {
            logList.innerHTML = ''; // Clear existing logs
            logs.forEach(log => {
                const newLog = document.createElement('p');
                newLog.textContent = `Date: ${log.date}, Time: ${log.time}, Language: ${log.language}, Topic: ${log.topic}, Notes: ${log.notes}`;
                logList.appendChild(newLog);
            });
        }
    }

    // Function to display goals
    function displayGoals(goals) {
        const goalList = document.getElementById('goalList');
        if (goalList) {
            goalList.innerHTML = ''; // Clear existing goals
            goals.forEach(goal => {
                const newGoal = document.createElement('p');
                newGoal.textContent = `Goal: ${goal.goalType}, Target Hours: ${goal.targetHours}`;
                goalList.appendChild(newGoal);
            });
        }
    }

    // Function to update dashboard
    function updateDashboard(logs) {
        let totalHours = 0;
        logs.forEach(log => {
            totalHours += log.time;
        });

        const totalHoursElement = document.getElementById('totalHours');
        if (totalHoursElement) {
            totalHoursElement.textContent = totalHours;
        }

        const recentLogElement = document.getElementById('recentLog');
        if (recentLogElement && logs.length > 0) {
            const recentLog = logs[logs.length - 1];
            recentLogElement.textContent = `Date: ${recentLog.date}, Language: ${recentLog.language}`;
        } else if (recentLogElement) {
            recentLogElement.textContent = 'N/A';
        }
    }

    // Function to add a log
    function addLog(date, time, language, topic, notes) {
        let logs = JSON.parse(localStorage.getItem('logs') || '[]');
        const newLog = { date, time, language, topic, notes };
        logs.push(newLog);
        localStorage.setItem('logs', JSON.stringify(logs));

        displayLogs(logs);
        updateDashboard(logs);
        updateCharts(logs);
    }

    // Function to set a goal
    function setGoal(goalType, targetHours) {
        let goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const newGoal = { goalType, targetHours };
        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));

        displayGoals(goals);
    }

    // Chart Initialization and Update
    function initializeCharts() {
        const codingTrendsCanvas = document.getElementById('codingTrendsChart');
        const languageBreakdownCanvas = document.getElementById('languageBreakdownChart');

        if (codingTrendsCanvas) {
            codingTrendsChart = new Chart(codingTrendsCanvas, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Hours Coded',
                        data: [],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        if (languageBreakdownCanvas) {
            languageBreakdownChart = new Chart(languageBreakdownCanvas, {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Hours Coded',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 206, 86, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
        }

        // Initial chart update
        const logs = JSON.parse(localStorage.getItem('logs') || '[]');
        updateCharts(logs);
    }

    function updateCharts(logs) {
        if (codingTrendsChart) {
            const weeklyData = {};
            logs.forEach(log => {
                const week = getWeekNumber(new Date(log.date));
                if (!weeklyData[week]) {
                    weeklyData[week] = 0;
                }
                weeklyData[week] += log.time;
            });

            const labels = Object.keys(weeklyData).sort();
            const data = labels.map(week => weeklyData[week]);

            codingTrendsChart.data.labels = labels;
            codingTrendsChart.data.datasets[0].data = data;
            codingTrendsChart.update();
        }

        if (languageBreakdownChart) {
            const languageData = {};
            logs.forEach(log => {
                if (!languageData[log.language]) {
                    languageData[log.language] = 0;
                }
                languageData[log.language] += log.time;
            });

            const labels = Object.keys(languageData);
            const data = labels.map(language => languageData[language]);

            languageBreakdownChart.data.labels = labels;
            languageBreakdownChart.data.datasets[0].data = data;
            languageBreakdownChart.update();
        }
    }

    // Helper function to get week number
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return d.getUTCFullYear() + '-W' + weekNo;
    }
});
