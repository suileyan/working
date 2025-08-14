/**
 * 用户端JavaScript功能
 * 包含首页、检测、历史、知识、统计等模块功能
 */

// 全局变量
let currentImage = null;
let recognitionHistory = [];
let userStats = {
    totalDetections: 0,
    correctClassifications: 0,
    weeklyDetections: 0,
    achievements: []
};

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDetectionModule();
    loadHistory();
    loadUserStats();
    initializeKnowledgeModule();
});

/**
 * 初始化导航功能
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 根据不同模块执行相应的初始化
                switch(targetId) {
                    case 'home':
                        updateHomeStats();
                        break;
                    case 'detection':
                        resetDetectionArea();
                        break;
                    case 'history':
                        updateHistoryDisplay();
                        break;
                    case 'knowledge':
                        loadKnowledgeContent();
                        break;
                    case 'statistics':
                        updateStatisticsDisplay();
                        break;
                }
            }
        });
    });
}

/**
 * 更新首页统计信息
 */
function updateHomeStats() {
    const totalDetectionsEl = document.getElementById('totalDetections');
    const accuracyRateEl = document.getElementById('accuracyRate');
    const weeklyDetectionsEl = document.getElementById('weeklyDetections');
    
    if (totalDetectionsEl) totalDetectionsEl.textContent = userStats.totalDetections;
    if (accuracyRateEl) {
        const accuracy = userStats.totalDetections > 0 ? 
            (userStats.correctClassifications / userStats.totalDetections * 100).toFixed(1) : 0;
        accuracyRateEl.textContent = accuracy + '%';
    }
    if (weeklyDetectionsEl) weeklyDetectionsEl.textContent = userStats.weeklyDetections;
}

/**
 * 初始化检测模块
 */
function initializeDetectionModule() {
    // 图片上传
    const imageInput = document.getElementById('imageInput');
    const imageUploadArea = document.getElementById('imageUploadArea');
    
    if (imageInput && imageUploadArea) {
        imageInput.addEventListener('change', handleImageUpload);
        
        // 拖拽上传
        imageUploadArea.addEventListener('dragover', handleDragOver);
        imageUploadArea.addEventListener('dragleave', handleDragLeave);
        imageUploadArea.addEventListener('drop', handleImageDrop);
    }
    
    // 视频上传
    const videoInput = document.getElementById('videoInput');
    if (videoInput) {
        videoInput.addEventListener('change', handleVideoUpload);
    }
    
    // 实时检测按钮
    const realtimeBtn = document.getElementById('realtimeBtn');
    if (realtimeBtn) {
        realtimeBtn.addEventListener('click', startRealtimeDetection);
    }
}

/**
 * 处理图片上传
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    } else {
        alert('请选择有效的图片文件！');
    }
}

/**
 * 处理拖拽悬停
 */
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#357abd';
    e.currentTarget.style.backgroundColor = '#f0f7ff';
}

/**
 * 处理拖拽离开
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#4a90e2';
    e.currentTarget.style.backgroundColor = '#f8faff';
}

/**
 * 处理图片拖拽放置
 */
function handleImageDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#4a90e2';
    e.currentTarget.style.backgroundColor = '#f8faff';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        processImageFile(files[0]);
    }
}

/**
 * 处理视频上传
 */
function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
        processVideoFile(file);
    } else {
        alert('请选择有效的视频文件！');
    }
}

/**
 * 处理图片文件
 */
function processImageFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('图片文件大小不能超过10MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(e.target.result);
        startImageDetection(e.target.result);
    };
    reader.readAsDataURL(file);
}

/**
 * 处理视频文件
 */
function processVideoFile(file) {
    if (file.size > 50 * 1024 * 1024) {
        alert('视频文件大小不能超过50MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        showVideoPreview(e.target.result);
        startVideoDetection(e.target.result);
    };
    reader.readAsDataURL(file);
}

/**
 * 显示图片预览
 */
function showImagePreview(imageSrc) {
    const resultArea = document.getElementById('detectionResult');
    const previewImage = document.getElementById('previewImage');
    
    if (previewImage && resultArea) {
        previewImage.src = imageSrc;
        resultArea.style.display = 'block';
    }
}

/**
 * 显示视频预览
 */
function showVideoPreview(videoSrc) {
    const resultArea = document.getElementById('detectionResult');
    const previewVideo = document.getElementById('previewVideo');
    
    if (previewVideo && resultArea) {
        previewVideo.src = videoSrc;
        resultArea.style.display = 'block';
    }
}

/**
 * 开始图片检测
 */
function startImageDetection(imageSrc) {
    showDetectionLoading();
    
    // 模拟AI检测过程
    setTimeout(() => {
        const result = generateMockDetectionResult();
        showDetectionResult(result, 'image', imageSrc);
        updateUserStats();
    }, 2000 + Math.random() * 2000);
}

/**
 * 开始视频检测
 */
function startVideoDetection(videoSrc) {
    showDetectionLoading();
    
    // 模拟视频检测过程
    setTimeout(() => {
        const results = generateMockVideoResults();
        showVideoDetectionResults(results, videoSrc);
        updateUserStats();
    }, 3000 + Math.random() * 3000);
}

/**
 * 开始实时检测
 */
function startRealtimeDetection() {
    // 检查浏览器是否支持摄像头
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('您的浏览器不支持摄像头功能！');
        return;
    }
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('realtimeVideo');
            if (video) {
                video.srcObject = stream;
                video.style.display = 'block';
                
                // 开始实时检测循环
                startRealtimeLoop(video);
            }
        })
        .catch(err => {
            console.error('无法访问摄像头:', err);
            alert('无法访问摄像头，请检查权限设置！');
        });
}

/**
 * 开始实时检测循环
 */
function startRealtimeLoop(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    function detectFrame() {
        if (video.videoWidth > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // 模拟实时检测
            const result = generateMockDetectionResult();
            updateRealtimeResult(result);
        }
        
        // 每2秒检测一次
        setTimeout(detectFrame, 2000);
    }
    
    detectFrame();
}

/**
 * 更新实时检测结果
 */
function updateRealtimeResult(result) {
    const realtimeResult = document.getElementById('realtimeResult');
    if (realtimeResult) {
        realtimeResult.innerHTML = `
            <div class="realtime-detection-item">
                <span class="category-icon">${result.icon}</span>
                <div class="detection-info">
                    <h4>${result.name}</h4>
                    <p>置信度: ${(result.confidence * 100).toFixed(1)}%</p>
                </div>
            </div>
        `;
        realtimeResult.style.display = 'block';
    }
}

/**
 * 显示检测加载状态
 */
function showDetectionLoading() {
    const loadingEl = document.getElementById('detectionLoading');
    const resultEl = document.getElementById('detectionResultContent');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (resultEl) resultEl.style.display = 'none';
}

/**
 * 显示检测结果
 */
function showDetectionResult(result, type, src) {
    const loadingEl = document.getElementById('detectionLoading');
    const resultEl = document.getElementById('detectionResultContent');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (resultEl) {
        resultEl.innerHTML = `
            <div class="detection-result-item">
                <div class="result-header">
                    <span class="category-icon">${result.icon}</span>
                    <h3>${result.name}</h3>
                </div>
                <div class="result-details">
                    <p class="confidence">置信度: ${(result.confidence * 100).toFixed(1)}%</p>
                    <p class="description">${result.description}</p>
                    <div class="disposal-guide">
                        <h4>处理建议：</h4>
                        <p>${result.disposalGuide}</p>
                    </div>
                </div>
                <div class="result-actions">
                    <button onclick="saveDetectionResult('${type}', '${src}', ${JSON.stringify(result).replace(/"/g, '&quot;')})" class="btn btn-primary">保存结果</button>
                    <button onclick="resetDetectionArea()" class="btn btn-secondary">重新检测</button>
                </div>
            </div>
        `;
        resultEl.style.display = 'block';
    }
}

/**
 * 生成模拟检测结果
 */
function generateMockDetectionResult() {
    const categories = [
        {
            name: '可回收垃圾',
            icon: '♻️',
            description: '这是可回收垃圾，可以重新加工利用',
            disposalGuide: '请清洁后投放到蓝色可回收垃圾桶中',
            confidence: 0.92 + Math.random() * 0.07
        },
        {
            name: '厨余垃圾',
            icon: '🥬',
            description: '这是厨余垃圾，属于有机废物',
            disposalGuide: '请沥干水分后投放到绿色厨余垃圾桶中',
            confidence: 0.88 + Math.random() * 0.10
        },
        {
            name: '有害垃圾',
            icon: '☢️',
            description: '这是有害垃圾，含有有毒有害物质',
            disposalGuide: '请投放到红色有害垃圾桶中，需要特殊处理',
            confidence: 0.85 + Math.random() * 0.12
        },
        {
            name: '其他垃圾',
            icon: '🗑️',
            description: '这是其他垃圾，无法回收利用',
            disposalGuide: '请投放到灰色其他垃圾桶中',
            confidence: 0.80 + Math.random() * 0.15
        }
    ];
    
    return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * 保存检测结果
 */
function saveDetectionResult(type, src, result) {
    const historyItem = {
        id: Date.now(),
        type: type,
        src: src,
        category: result.name,
        confidence: result.confidence,
        timestamp: new Date().toLocaleString('zh-CN'),
        description: result.description
    };
    
    recognitionHistory.unshift(historyItem);
    localStorage.setItem('recognitionHistory', JSON.stringify(recognitionHistory));
    
    // 更新用户统计
    userStats.totalDetections++;
    userStats.weeklyDetections++;
    userStats.correctClassifications++; // 假设都是正确的
    saveUserStats();
    
    alert('检测结果已保存到历史记录！');
}

/**
 * 重置检测区域
 */
function resetDetectionArea() {
    const resultArea = document.getElementById('detectionResult');
    const imageInput = document.getElementById('imageInput');
    const videoInput = document.getElementById('videoInput');
    
    if (resultArea) resultArea.style.display = 'none';
    if (imageInput) imageInput.value = '';
    if (videoInput) videoInput.value = '';
    
    // 停止实时检测
    const realtimeVideo = document.getElementById('realtimeVideo');
    if (realtimeVideo && realtimeVideo.srcObject) {
        const tracks = realtimeVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        realtimeVideo.style.display = 'none';
    }
}

/**
 * 加载历史记录
 */
function loadHistory() {
    const saved = localStorage.getItem('recognitionHistory');
    if (saved) {
        recognitionHistory = JSON.parse(saved);
    }
}

/**
 * 更新历史记录显示
 */
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (recognitionHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><p>暂无检测记录</p></div>';
        return;
    }
    
    historyList.innerHTML = recognitionHistory.map(item => `
        <div class="history-item">
            <div class="history-media">
                ${item.type === 'image' ? 
                    `<img src="${item.src}" alt="检测图片">` : 
                    `<video src="${item.src}" controls></video>`
                }
            </div>
            <div class="history-info">
                <h4>${item.category}</h4>
                <p class="confidence">置信度: ${(item.confidence * 100).toFixed(1)}%</p>
                <p class="description">${item.description}</p>
                <span class="timestamp">${item.timestamp}</span>
            </div>
            <div class="history-actions">
                <button onclick="deleteHistoryItem(${item.id})" class="btn btn-danger btn-sm">删除</button>
            </div>
        </div>
    `).join('');
}

/**
 * 删除历史记录项
 */
function deleteHistoryItem(id) {
    if (confirm('确定要删除这条记录吗？')) {
        recognitionHistory = recognitionHistory.filter(item => item.id !== id);
        localStorage.setItem('recognitionHistory', JSON.stringify(recognitionHistory));
        updateHistoryDisplay();
    }
}

/**
 * 清空历史记录
 */
function clearAllHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        recognitionHistory = [];
        localStorage.removeItem('recognitionHistory');
        updateHistoryDisplay();
    }
}

/**
 * 初始化知识模块
 */
function initializeKnowledgeModule() {
    // 为知识卡片添加点击事件
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            showKnowledgeDetail(category);
        });
    });
}

/**
 * 加载知识内容
 */
function loadKnowledgeContent() {
    // 这里可以动态加载知识内容
    console.log('加载知识内容...');
}

/**
 * 显示知识详情
 */
function showKnowledgeDetail(category) {
    const knowledgeDetails = {
        'recyclable': {
            title: '可回收垃圾详解',
            content: '可回收垃圾包括纸类、塑料、金属、玻璃等可以重新加工利用的废物...'
        },
        'kitchen': {
            title: '厨余垃圾详解',
            content: '厨余垃圾是指家庭、餐厅、食堂等产生的食物残余和废料...'
        },
        'hazardous': {
            title: '有害垃圾详解',
            content: '有害垃圾是指含有有毒有害化学物质的垃圾...'
        },
        'other': {
            title: '其他垃圾详解',
            content: '其他垃圾是指除可回收垃圾、厨余垃圾、有害垃圾之外的垃圾...'
        }
    };
    
    const detail = knowledgeDetails[category];
    if (detail) {
        alert(`${detail.title}\n\n${detail.content}`);
    }
}

/**
 * 加载用户统计数据
 */
function loadUserStats() {
    const saved = localStorage.getItem('userStats');
    if (saved) {
        userStats = { ...userStats, ...JSON.parse(saved) };
    }
}

/**
 * 保存用户统计数据
 */
function saveUserStats() {
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

/**
 * 更新用户统计数据
 */
function updateUserStats() {
    // 检查是否获得新成就
    checkAchievements();
    saveUserStats();
}

/**
 * 更新统计显示
 */
function updateStatisticsDisplay() {
    // 更新个人使用统计
    const personalStats = document.getElementById('personalStats');
    if (personalStats) {
        personalStats.innerHTML = `
            <div class="stat-item">
                <h4>总检测次数</h4>
                <p class="stat-value">${userStats.totalDetections}</p>
            </div>
            <div class="stat-item">
                <h4>本周检测</h4>
                <p class="stat-value">${userStats.weeklyDetections}</p>
            </div>
            <div class="stat-item">
                <h4>准确率</h4>
                <p class="stat-value">${userStats.totalDetections > 0 ? (userStats.correctClassifications / userStats.totalDetections * 100).toFixed(1) : 0}%</p>
            </div>
        `;
    }
    
    // 更新成就显示
    const achievementsList = document.getElementById('achievementsList');
    if (achievementsList) {
        if (userStats.achievements.length === 0) {
            achievementsList.innerHTML = '<p class="empty-achievements">暂无获得成就</p>';
        } else {
            achievementsList.innerHTML = userStats.achievements.map(achievement => `
                <div class="achievement-item">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                        <span class="achievement-date">${achievement.date}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

/**
 * 检查成就
 */
function checkAchievements() {
    const achievements = [
        {
            id: 'first_detection',
            name: '初次尝试',
            description: '完成第一次垃圾分类检测',
            icon: '🎯',
            condition: () => userStats.totalDetections === 1
        },
        {
            id: 'detection_master',
            name: '分类达人',
            description: '累计完成100次检测',
            icon: '🏆',
            condition: () => userStats.totalDetections === 100
        },
        {
            id: 'weekly_active',
            name: '本周活跃',
            description: '本周完成10次检测',
            icon: '⭐',
            condition: () => userStats.weeklyDetections === 10
        }
    ];
    
    achievements.forEach(achievement => {
        if (achievement.condition() && !userStats.achievements.find(a => a.id === achievement.id)) {
            userStats.achievements.push({
                ...achievement,
                date: new Date().toLocaleString('zh-CN')
            });
            
            // 显示成就获得提示
            setTimeout(() => {
                alert(`🎉 恭喜获得成就：${achievement.name}\n${achievement.description}`);
            }, 1000);
        }
    });
}