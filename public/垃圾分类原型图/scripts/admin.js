/**
 * 管理端JavaScript功能
 * 包含页面切换、数据管理、图表显示等功能
 */

// 全局变量
let currentSection = 'dashboard';
let chartInstances = {};

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    loadDashboardData();
});

/**
 * 初始化导航功能
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 获取目标section
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
}

/**
 * 显示指定的内容区域
 * @param {string} sectionId - 要显示的区域ID
 */
function showSection(sectionId) {
    // 隐藏所有section
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 显示目标section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // 更新页面标题
        updatePageTitle(sectionId);
        
        // 根据不同section加载相应数据
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'users':
                loadUsersData();
                break;
            case 'model':
                loadModelData();
                break;
            case 'data':
                loadDataManagement();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
}

/**
 * 更新页面标题
 * @param {string} sectionId - 当前section ID
 */
function updatePageTitle(sectionId) {
    const titles = {
        'dashboard': '数据统计',
        'users': '用户管理',
        'model': '模型管理',
        'data': '数据管理',
        'settings': '系统设置'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && titles[sectionId]) {
        pageTitle.textContent = titles[sectionId];
    }
}

/**
 * 初始化图表
 */
function initializeCharts() {
    // 这里使用Canvas绘制简单的模拟图表
    // 在实际项目中，建议使用Chart.js、ECharts等图表库
    
    setTimeout(() => {
        drawDailyChart();
        drawCategoryChart();
    }, 100);
}

/**
 * 绘制每日识别量图表
 */
function drawDailyChart() {
    const canvas = document.getElementById('dailyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 模拟数据
    const data = [120, 150, 180, 200, 170, 190, 220];
    const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    // 绘制坐标轴
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 40);
    ctx.stroke();
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(50, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    
    // 绘制数据线
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const stepX = (width - 70) / (data.length - 1);
    const maxY = Math.max(...data);
    
    data.forEach((value, index) => {
        const x = 50 + index * stepX;
        const y = height - 40 - (value / maxY) * (height - 60);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // 绘制数据点
        ctx.fillStyle = '#4a90e2';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    // 绘制标签
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = 50 + index * stepX;
        ctx.fillText(label, x, height - 20);
    });
}

/**
 * 绘制分类分布饼图
 */
function drawCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 模拟数据
    const data = [
        { label: '可回收垃圾', value: 40, color: '#4CAF50' },
        { label: '厨余垃圾', value: 30, color: '#FF9800' },
        { label: '有害垃圾', value: 15, color: '#F44336' },
        { label: '其他垃圾', value: 15, color: '#9E9E9E' }
    ];
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let currentAngle = 0;
    
    data.forEach(item => {
        const sliceAngle = (item.value / 100) * 2 * Math.PI;
        
        // 绘制扇形
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // 绘制标签
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.label}`, labelX, labelY);
        ctx.fillText(`${item.value}%`, labelX, labelY + 15);
        
        currentAngle += sliceAngle;
    });
}

/**
 * 加载仪表板数据
 */
function loadDashboardData() {
    // 模拟加载统计数据
    updateStatCards();
    
    // 重新绘制图表
    setTimeout(() => {
        drawDailyChart();
        drawCategoryChart();
    }, 100);
}

/**
 * 更新统计卡片数据
 */
function updateStatCards() {
    // 模拟动态数据更新
    const stats = [
        { value: Math.floor(Math.random() * 1000) + 1000, suffix: '' },
        { value: Math.floor(Math.random() * 2000) + 5000, suffix: '' },
        { value: (Math.random() * 5 + 90).toFixed(1), suffix: '%' },
        { value: '+' + Math.floor(Math.random() * 20 + 5), suffix: '%' }
    ];
    
    const statCards = document.querySelectorAll('.stat-card h3');
    statCards.forEach((card, index) => {
        if (stats[index]) {
            card.textContent = stats[index].value + stats[index].suffix;
        }
    });
}

/**
 * 加载用户数据
 */
function loadUsersData() {
    console.log('加载用户管理数据...');
    // 这里可以添加用户数据加载逻辑
}

/**
 * 加载模型数据
 */
function loadModelData() {
    console.log('加载模型管理数据...');
    // 这里可以添加模型数据加载逻辑
}

/**
 * 加载数据管理
 */
function loadDataManagement() {
    console.log('加载数据管理...');
    // 这里可以添加数据管理逻辑
}

/**
 * 加载系统设置
 */
function loadSettings() {
    console.log('加载系统设置...');
    // 这里可以添加设置加载逻辑
}

/**
 * 退出登录
 */
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        localStorage.removeItem('adminToken');
        
        // 跳转到登录页面
        window.location.href = 'login.html';
    }
}

// 为退出按钮添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});