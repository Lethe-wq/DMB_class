# 数据库课程作业
## 会员展示平台

### 使用php作为后端服务



 一点收获：1、php后端配置文件统一管理数据库 2、sql语句命名3、前端html 类型的定义，全局css 还有不同容器的css风格

 实现毛玻璃
```css
.container {
    /* 上下外边距10px，auto实现左右自动居中 */
    margin: 10px auto;
    /* 盒子内部留白，内容与边框拉开距离 */
    padding: 30px;

    /* rgba：白色半透明底色，0.65代表透明度，实现玻璃通透底色 */
    background: rgba(255, 255, 255, 0.384);
    /* 毛玻璃核心：模糊容器后方背景画面，数值越大越朦胧 */
    backdrop-filter: blur(15px);
    /* webkit前缀，兼容Safari苹果浏览器 */
    -webkit-backdrop-filter: blur(12px);
    /* 半透明白色细边框，模拟玻璃边缘高光质感 */
    border: 1px solid rgba(250, 207, 252, 0.904);

    /* 圆角，圆润玻璃边角 */
    border-radius: 24px;
    /* 阴影：x偏移0、y向下2px、虚化12px、黑色透明度0.08，营造悬浮感 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    /* 所有属性变化0.3秒平滑过渡，hover渐变不突兀 */
    transition: all 0.3s ease;
}

/* 鼠标悬浮高亮效果 */
.container:hover {
    /* 透明度提升，玻璃变亮，实现淡淡高亮 */
    background: rgba(255, 255, 255, 0.25);
    /* 阴影下移、变大加深，卡片视觉上浮 */
    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
}
```

 防止sql注入到底是怎么个事情：
 ```sql
 // 使用 prepared statement 防止 SQL 注入
 $stmt = $conn->prepare("DELETE FROM user WHERE id = ?");
 $stmt->bind_param('i', $id);
```
